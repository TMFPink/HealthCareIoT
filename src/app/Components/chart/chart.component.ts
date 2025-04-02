import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  imports: [IonContent, NgxEchartsModule, CommonModule, FormsModule],
})
export class ChartComponent implements OnInit {
  chartOption: EChartsOption = {};
  intervalId: any;
  data: number[] = [];
  labels: string[] = [];
  activeTab: 'live' | 'day' | 'month' = 'live';
  dayData: any[] = []; // Placeholder for day data
  dayChartOption: EChartsOption = {};
  selectedDate: string = ''; // Selected date for day chart
  monthData: any[] = []; // Placeholder for month data
  monthChartOption: EChartsOption = {};
  displayArray: any[] = [];
  selectedMonth: string = ''; // Selected month for month chart

  ngOnInit(): void {
    this.wsService.connect(environment.wsUrl);
    this.wsService.onMessage().subscribe((data) => {
      this.displayArray.push(data);
      this.updateChart(); // Update chart whenever new data is received
    });
    this.initChart();
  }

  constructor(private wsService: WebSocketService, private http: HttpClient) {}

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  initChart(): void {
    const upperThreshold = 85; // Example upper threshold value
    const middleThreshold = 75; // Example middle threshold value
    const lowerThreshold = 65; // Example lower threshold value

    this.chartOption = {
      title: {
        text: 'Real-Time Heart Rate',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: this.labels,
        name: 'Time',
      },
      yAxis: {
        type: 'value',
        name: 'BPM',
      },
      series: [
        {
          name: 'Heart Rate',
          type: 'line',
          data: this.data,
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#ff4d4f',
          },
          showSymbol: false,
        },
      ],
      animation: false,
    };
  }

  updateChart(): void {
    const maxDataPoints = 20; // Limit the number of data points displayed
    const now = new Date();
    const timeLabel = now.toLocaleTimeString().slice(0, 8);

    const latestData = this.displayArray[this.displayArray.length - 1];
    if (latestData != null) {
      this.labels.push(timeLabel);
      this.data.push(parseFloat(latestData.toFixed(2)));

      if (this.labels.length > maxDataPoints) {
        this.labels.shift();
        this.data.shift();
      }
      console.log(this.labels, this.data);

      this.chartOption = {
        ...this.chartOption,
        xAxis: {
          ...(this.chartOption.xAxis as any),
          data: this.labels,
        },
        series: [
          {
            name: 'Heart Rate',
            type: 'line',
            data: this.data,
            smooth: true,
            lineStyle: {
              width: 3,
            },
            itemStyle: {
              color: '#ff4d4f',
            },
            showSymbol: false,
          },
        ],
      };
    }
  }

  switchTab(tab: 'live' | 'day' | 'month'): void {
    this.activeTab = tab;
    if (tab === 'day') {
      this.loadDayData();
      this.initDayChart();
    } else if (tab === 'month') {
      this.loadMonthData();
      this.initMonthChart();
    }
  }

  loadDayData(): void {
    if (!this.selectedDate) {
      console.warn('No date selected for day data');
      return;
    }
    this.http
      .get<{ status: string; data: { label: string; value: number | null }[] }>(
        `${environment.apiUrl}/bpm-data/day?date=${this.selectedDate}`
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.dayData = response.data.map((item) => ({
              time: item.label,
              value:
                item.value !== null ? parseFloat(item.value.toFixed(2)) : 0, // Use 0 for null values
            }));
            this.initDayChart();
          } else {
            console.error('Unexpected response status:', response.status);
          }
        },
        error: (err) => {
          console.error('Failed to load day data', err);
        },
      });
  }

  initDayChart(): void {
    const dayLabels = this.dayData.map((item) => item.time); // Ensure all labels are included
    const dayValues = this.dayData.map((item) => item.value); // Include 0 for null values
    this.dayChartOption = {
      title: {
        text: 'Day Heart Rate',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: dayLabels,
        name: 'Time',
      },
      yAxis: {
        type: 'value',
        name: 'BPM',
      },
      series: [
        {
          name: 'Heart Rate',
          type: 'line',
          data: dayValues,
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#ff4d4f',
          },
          showSymbol: false,
        },
      ],
    };
  }

  loadMonthData(): void {
    if (!this.selectedMonth) {
      console.warn('No month selected for month data');
      return;
    }
    this.http
      .get<{ status: string; data: { day: string; average: number | null }[] }>(
        `${environment.apiUrl}/bpm-data/month?month=${this.selectedMonth}`
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.monthData = response.data.map((item) => ({
              date: item.day, // Use 'day' from the API response
              value:
                item.average != null ? parseFloat(item.average.toFixed(2)) : 0, // Set to 0 for null values
            }));
            this.initMonthChart();
          } else {
            console.error('Unexpected response status:', response.status);
          }
        },
        error: (err) => {
          console.error('Failed to load month data', err);
        },
      });
  }

  getStatus(value: number): string {
    const formattedValue = parseFloat(value.toFixed(2));
    if (formattedValue < 70) {
      return 'Low';
    } else if (formattedValue >= 70 && formattedValue <= 80) {
      return 'Normal';
    } else {
      return 'High';
    }
  }

  getStatusBgColor(status: string): string {
    switch (status) {
      case 'Low':
        return 'bg-red-500 text-white';
      case 'Normal':
        return 'bg-green-500 text-white';
      case 'High':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-300 text-black';
    }
  }

  initMonthChart(): void {
    const monthLabels = this.monthData.map((item) => item.date);
    const monthValues = this.monthData.map((item) => item.value);
    this.monthChartOption = {
      title: {
        text: 'Month Heart Rate',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: monthLabels,
        name: 'Date',
      },
      yAxis: {
        type: 'value',
        name: 'BPM',
      },
      series: [
        {
          name: 'Heart Rate',
          type: 'line',
          data: monthValues,
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#ff4d4f',
          },
          showSymbol: false,
        },
      ],
    };
  }
}
