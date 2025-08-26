import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import MultiChart from '../components/Chart';
import ThreeDScatterPlot from '../components/ThreeDScatterPlot';
import { Download, Upload, BarChart2, ScatterChart } from 'lucide-react';

const UploadPage = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [zAxis, setZAxis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const token = localStorage.getItem('token');
  const threeDRef = useRef();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('excelData') || '[]');
    const savedHeaders = JSON.parse(localStorage.getItem('excelHeaders') || '[]');
    const savedXAxis = localStorage.getItem('excelXAxis') || '';
    const savedYAxis = localStorage.getItem('excelYAxis') || '';
    const savedZAxis = localStorage.getItem('excelZAxis') || '';

    setData(savedData);
    setHeaders(savedHeaders);
    setXAxis(savedXAxis);
    setYAxis(savedYAxis);
    setZAxis(savedZAxis);
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.match(/\.(xlsx|xls)$/)) {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (uploadRes.status === 201) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });

          if (!parsedData.length) return;

          const [firstRow] = parsedData;
          setData(parsedData);
          setHeaders(firstRow);
          setXAxis(firstRow[0]);
          setYAxis(firstRow[1]);
          setZAxis(firstRow[2]);

          localStorage.setItem('excelData', JSON.stringify(parsedData));
          localStorage.setItem('excelHeaders', JSON.stringify(firstRow));
          localStorage.setItem('excelXAxis', firstRow[0]);
          localStorage.setItem('excelYAxis', firstRow[1]);
          localStorage.setItem('excelZAxis', firstRow[2]);

          localStorage.setItem('refreshHistory', Date.now().toString());
          window.dispatchEvent(new Event('storage'));
          setIsLoading(false);
        };
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
      setIsLoading(false);
    }
  };

  const generateChartData = useCallback(() => {
    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);
    if (xIndex === -1 || yIndex === -1) return null;

    const labels = data.slice(1).map(row => row[xIndex]);
    const values = data.slice(1).map(row => Number(row[yIndex]) || 0);
    return { labels, values };
  }, [xAxis, yAxis, headers, data]);

  useEffect(() => {
    const chartData = generateChartData();
    if (token && chartData) {
      axios.post('http://localhost:5000/api/activity/track-chart', {
        chartType: 'Bar Chart',
        excelFileName: data.length > 0 ? 'Uploaded Excel' : 'unknown',
        imageUrl: '/charts/bar_chart.png',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
  }, [xAxis, yAxis, data, token, generateChartData]);

  const handleDownload = async () => {
    if (!threeDRef.current?.downloadImage) return;
    
    setIsDownloading(true);
    try {
      const imageData = await threeDRef.current.downloadImage();
      
      await axios.post('http://localhost:5000/api/activity/track-download', {
        excelFileName: data.length > 0 ? 'Uploaded Excel' : 'unknown',
        chartType: '3D Scatter Plot',
        imageUrl: imageData || '/charts/3d_scatter.png',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('refreshHistory', Date.now().toString());
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Download tracking error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 shadow-lg text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Data Visualization Dashboard</h1>
          <p className="text-indigo-100">Upload, analyze and visualize your Excel data</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <Upload className="text-indigo-600 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Upload Excel File</h2>
          </div>
          
          <div className="space-y-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-blue-500 file:to-indigo-600
                file:text-white
                hover:file:from-blue-600 hover:file:to-indigo-700
                file:cursor-pointer
                file:transition-all file:duration-200
                file:shadow-md"
              disabled={isLoading}
            />
            
            {isLoading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Processing your file...</p>
              </div>
            )}
          </div>
        </div>

        {/* Axis Selection - Only shows when data is loaded */}
        {headers.length > 1 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Configure Visualization</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['X-Axis', 'Y-Axis', 'Z-Axis'].map((label) => {
                const axisKey = label[0].toLowerCase() + 'Axis';
                const value = { xAxis, yAxis, zAxis }[axisKey];
                const setter = { xAxis: setXAxis, yAxis: setYAxis, zAxis: setZAxis }[axisKey];
                
                return (
                  <div key={label} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={value}
                      onChange={(e) => {
                        setter(e.target.value);
                        localStorage.setItem(`excel${label.replace('-', '')}`, e.target.value);
                      }}
                    >
                      {headers.map((header, i) => (
                        <option key={i} value={header}>{header}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2D Chart - Only shows when X and Y axes are selected */}
        {data.length > 1 && xAxis && yAxis && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <BarChart2 className="text-blue-600 mr-2" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">2D Chart Visualization</h2>
            </div>
            <div className="h-96">
              <MultiChart data={data} headers={headers} xAxis={xAxis} yAxis={yAxis} />
            </div>
          </div>
        )}

        {/* 3D Chart - Only shows when X, Y and Z axes are selected */}
        {data.length > 1 && xAxis && yAxis && zAxis && (
          <div className="bg-white rounded-xl shadow-md p-6 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex items-center mb-2 md:mb-0">
                <ScatterChart className="text-purple-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">3D Scatter Plot</h2>
              </div>
            </div>

            <div className="h-[500px] relative">
              <ThreeDScatterPlot
                ref={threeDRef}
                data={data}
                xAxis={xAxis}
                yAxis={yAxis}
                zAxis={zAxis}
              />
              
              {/* Floating Download Button */}
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] ${
                    isDownloading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;