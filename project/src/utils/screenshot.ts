import { IChartApi } from 'lightweight-charts';

export const takeScreenshot = (chart: IChartApi) => {
  return new Promise<string>((resolve) => {
    // Lightweight-charts provides a built-in screenshot functionality
    chart.takeScreenshot().toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `chart-${new Date().toISOString()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        resolve('Screenshot saved successfully');
      }
    });
  });
};