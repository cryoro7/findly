<template>
  <div class="map-container">
    <div ref="chartDiv" class="chart-div"></div>
    <div class="legend">
      <div class="legend-item">
        <span class="marker low"></span>
        <span>Low</span>
      </div>
      <div class="legend-item">
        <span class="marker alert"></span>
        <span>Alert</span>
      </div>
      <div class="legend-item">
        <span class="marker attention"></span>
        <span>Attention</span>
      </div>
    </div>

    <!-- Modal for detailed information -->
    <div v-if="showDetailModal" class="detail-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedRegion.region }} Details</h3>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <div class="stat-item">
            <div class="stat-label">Anomali Value</div>
            <div class="stat-value">{{ selectedRegion.value }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Change</div>
            <div class="stat-value" :class="{ positive: selectedRegion.change.includes('+') }">
              {{ selectedRegion.change }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Status</div>
            <div class="stat-value" :class="selectedRegion.status.toLowerCase()">
              {{ selectedRegion.status }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Location</div>
            <div class="stat-value">{{ selectedRegion.longitude }}°, {{ selectedRegion.latitude }}°</div>
          </div>
          <div class="chart-placeholder">
            <h4>Historical Data</h4>
            <div class="mini-chart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="status-container">
    <!-- Low Status -->
    <div class="status-card">
      <div class="status-header">
        <div class="icon-wrapper low">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="status-text">
          <div class="status-title">Low</div>
          <div class="status-subtitle">Area</div>
        </div>
      </div>
      <div class="status-value">
        <div class="percentage">10%</div>
        <div class="fraction">10/200</div>
      </div>
    </div>

    <!-- Alert Status -->
    <div class="status-card">
      <div class="status-header">
        <div class="icon-wrapper alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="status-text">
          <div class="status-title">Alert</div>
          <div class="status-subtitle">Area</div>
        </div>
      </div>
      <div class="status-value">
        <div class="percentage">10%</div>
        <div class="fraction">10/200</div>
      </div>
    </div>

    <!-- Attention Status -->
    <div class="status-card">
      <div class="status-header">
        <div class="icon-wrapper attention">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="status-text">
          <div class="status-title">Attention</div>
          <div class="status-subtitle">Area</div>
        </div>
      </div>
      <div class="status-value">
        <div class="percentage">10%</div>
        <div class="fraction">10/200</div>
      </div>
    </div>
  </div>
</template>

<script>
import { router } from '@/router';
import { defineComponent, onMounted, onUnmounted, ref, reactive } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_indonesiaLow from '@amcharts/amcharts5-geodata/indonesiaLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useCustomizerStore } from '@/stores/customizer';
export default defineComponent({
  name: 'IndonesiaStatusMap',
  setup() {
    const store = useCustomizerStore();
    store.SET_TITLE('Dashboard', '');
    const chartDiv = ref(null);
    let root = null;
    let currentTooltip = null;
    const showDetailModal = ref(false);
    const selectedRegion = reactive({
      region: '',
      value: 0,
      change: '',
      status: '',
      longitude: 0,
      latitude: 0
    });

    // Sample data for the markers
    const markerData = [
      { longitude: 95.3, latitude: 5.5, status: 'low', region: 'Aceh', value: 5, change: '+12%' },
      { longitude: 98.7, latitude: 3.6, status: 'low', region: 'Sumatra Utara', value: 8, change: '+5%' },
      { longitude: 101.4, latitude: 0.5, status: 'alert', region: 'Riau', value: 12, change: '+18%' },
      { longitude: 102.2, latitude: -0.9, status: 'alert', region: 'Jambi', value: 10, change: '+7%' },
      { longitude: 104.7, latitude: -2.9, status: 'low', region: 'Sumatra Selatan', value: 6, change: '+3%' },
      { longitude: 106.8, latitude: -6.2, status: 'attention', region: 'DKI Jakarta', value: 15, change: '+22%' },
      { longitude: 110.4, latitude: -7.0, status: 'attention', region: 'Jawa Tengah', value: 18, change: '+30%' },
      { longitude: 112.7, latitude: -7.3, status: 'alert', region: 'Jawa Timur', value: 14, change: '+15%' },
      { longitude: 115.2, latitude: -8.7, status: 'attention', region: 'Bali', value: 16, change: '+25%' },
      { longitude: 119.4, latitude: -8.6, status: 'alert', region: 'Nusa Tenggara Barat', value: 11, change: '+9%' },
      { longitude: 123.5, latitude: -10.1, status: 'attention', region: 'WILAYAH NTT', value: 20, change: '+45%' },
      { longitude: 116.4, latitude: -3.3, status: 'low', region: 'Kalimantan Selatan', value: 7, change: '+4%' },
      { longitude: 117.9, latitude: 4.1, status: 'low', region: 'Kalimantan Utara', value: 4, change: '+2%' },
      { longitude: 124.8, latitude: 1.5, status: 'low', region: 'Sulawesi Utara', value: 5, change: '+3%' },
      { longitude: 127.4, latitude: 0.7, status: 'alert', region: 'Maluku Utara', value: 13, change: '+11%' },
      { longitude: 130.9, latitude: -2.5, status: 'low', region: 'Papua Barat', value: 6, change: '+5%' },
      { longitude: 138.7, latitude: -4.3, status: 'low', region: 'Papua', value: 8, change: '+6%' },
      { longitude: 110.0, latitude: -3.1, status: 'alert', region: 'Kalimantan Tengah', value: 12, change: '+14%' },
      { longitude: 106.6, latitude: -2.1, status: 'low', region: 'Bangka Belitung', value: 5, change: '+3%' },
      { longitude: 122.5, latitude: -5.1, status: 'alert', region: 'Sulawesi Tengah', value: 10, change: '+8%' }
    ];

    const showDetails = (dataItem) => {
      // Find the marker data for the selected region
      const regionData = markerData.find((item) => item.region === dataItem.region);
      if (regionData) {
        // Update the selected region data
        selectedRegion.region = regionData.region;
        selectedRegion.value = regionData.value;
        selectedRegion.change = regionData.change;
        selectedRegion.status = dataItem.status;
        selectedRegion.longitude = regionData.longitude;
        selectedRegion.latitude = regionData.latitude;

        // Show the modal
        showDetailModal.value = true;

        // Hide the tooltip
        if (currentTooltip) {
          currentTooltip.hide();
        }
      }
    };

    const closeModal = () => {
      showDetailModal.value = false;
    };

    onMounted(() => {
      // Create root element
      root = am5.Root.new(chartDiv.value);

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      // Create the map chart
      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'none', // Disable panning
          panY: 'none', // Disable panning
          wheelX: 'none', // Disable wheel zoom
          wheelY: 'none', // Disable wheel zoom
          pinchZoom: false, // Disable pinch zoom
          projection: am5map.geoMercator(),
          homeZoomLevel: 1,
          homeGeoPoint: { longitude: 118, latitude: -2 }
        })
      );

      // Create main polygon series for countries
      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_indonesiaLow,
          exclude: ['MY', 'SG', 'BN', 'TL', 'PG']
        })
      );

      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xdddddd),
        strokeWidth: 0.5,
        stroke: am5.color(0xffffff)
      });

      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color(0xcccccc)
      });

      // Background series
      const backgroundSeries = chart.series.unshift(am5map.MapPolygonSeries.new(root, {}));

      backgroundSeries.mapPolygons.template.setAll({
        fill: am5.color(0x67b7dc),
        stroke: am5.color(0x67b7dc)
      });

      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, -15, 145, 10)
      });

      // Create custom tooltip
      const tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        paddingBottom: 0,
        paddingRight: 0,
        paddingLeft: 0,
        paddingTop: 0,
        maxWidth: 200
      });

      tooltip.get('background').setAll({
        fill: am5.color(0x101621),
        fillOpacity: 0.9,
        cornerRadius: 4
      });

      tooltip.label.setAll({
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12
      });

      // Store the tooltip for later reference
      currentTooltip = tooltip;

      // Create point series for markers
      const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

      // Define marker appearance based on status
      // pointSeries.bullets.push(() => {
      //   const container = am5.Container.new(root, {
      //     cursorOverStyle: 'pointer'
      //   });

      //   const circle = container.children.push(
      //     am5.Circle.new(root, {
      //       radius: 10,
      //       cursorOverStyle: 'pointer',
      //       templateField: 'circleSettings'
      //     })
      //   );

      //   const icon = container.children.push(
      //     am5.Picture.new(root, {
      //       width: 12,
      //       height: 12,
      //       centerX: am5.p50,
      //       centerY: am5.p50,
      //       templateField: 'iconSettings'
      //     })
      //   );

      //   // Add click event to show tooltip
      //   // container.events.on('click', function (ev) {
      //   //   const dataItem = ev.target.dataItem;
      //   //   if (dataItem && dataItem.dataContext) {
      //   //     const data = dataItem.dataContext;

      //   //     // Set tooltip content
      //   //     tooltip.label.set('html', createTooltipContent(data));

      //   //     // Show tooltip at the clicked position
      //   //     tooltip.set('tooltipTarget', ev.target);
      //   //     tooltip.show();
      //   //     // showDetails(data);
      //   //     // Add click event listener to the button after the tooltip is rendered
      //   //     setTimeout(() => {
      //   //       const buttonId = `detail-button-${data.region.replace(/\s+/g, '-').toLowerCase()}`;
      //   //       const detailButton = document.getElementById(buttonId);
      //   //       if (detailButton) {
      //   //         detailButton.addEventListener('click', function () {
      //   //           showDetails(data);
      //   //         });
      //   //       }
      //   //     }, 100);
      //   //   }
      //   // });

      //   return am5.Bullet.new(root, {
      //     sprite: container
      //   });
      // });

      pointSeries.bullets.push(() => {
        const container = am5.Container.new(root, {});

        const circle = container.children.push(
          am5.Circle.new(root, {
            radius: 10,
            cursorOverStyle: 'pointer',
            templateField: 'circleSettings',
            tooltipText: '{region}'
          })
        );

        const icon = container.children.push(
          am5.Picture.new(root, {
            width: 12,
            height: 12,
            centerX: am5.p50,
            centerY: am5.p50,
            templateField: 'iconSettings'
          })
        );
        container.events.on('click', function (ev) {
          const dataItem = ev.target.dataItem;
          if (dataItem && dataItem.dataContext) {
            const data = dataItem.dataContext;

            // Set tooltip content
            tooltip.label.set('html', createTooltipContent(data));

            // Show tooltip at the clicked position
            tooltip.set('tooltipTarget', ev.target);
            tooltip.show();
            // showDetails(data);
            router.push('/detail');

            // Add click event listener to the button after the tooltip is rendered
            // setTimeout(() => {
            //   const buttonId = `detail-button-${data.region.replace(/\s+/g, '-').toLowerCase()}`;
            //   const detailButton = document.getElementById(buttonId);
            //   if (detailButton) {
            //     detailButton.addEventListener('click', function () {
            //       showDetails(data);
            //     });
            //   }
            // }, 100);
          }
        });

        return am5.Bullet.new(root, {
          sprite: container
        });
      });

      pointSeries.set('tooltip', tooltip);
      // Function to create tooltip content
      const createTooltipContent = (data) => {
        const buttonId = `detail-button-${data.region.replace(/\s+/g, '-').toLowerCase()}`;

        return `
          <div style="text-align: center; color: white; padding: 8px 0;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${data.region}</div>
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 4px;">${data.value}</div>
            <div style="font-size: 14px; margin-bottom: 8px;">Anomali</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <div style="background-color: #5AD8A6; color: white; padding: 4px 8px; border-radius: 4px; display: flex; align-items: center;">
                <span style="margin-right: 4px;">↑</span> ${data.change}
              </div>
            </div>
          </div>
        `;
      };

      currentTooltip.label.adapters.add('html', (html, target) => {
        const dataItem = target.dataItem;
        if (dataItem && dataItem.dataContext) {
          const data = dataItem.dataContext;
          const buttonId = `detail-button-${data.region.replace(/\s+/g, '-').toLowerCase()}`;

          return `
            <div style="text-align: center; color: white; padding: 8px 0;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${data.region}</div>
              <div style="font-size: 24px; font-weight: bold; margin-bottom: 4px;">${data.value}</div>
              <div style="font-size: 14px; margin-bottom: 8px;">Anomali</div>
              <div style=" align-items: center; margin-top: 8px;">
                <div style="background-color: #5AD8A6; color: white; padding: 4px 8px; border-radius: 4px; display: flex; align-items: center;">
                  <span style="margin-right: 4px;">↑</span> ${data.change}
                </div>
              </div>
            </div>
          `;
        }
        return html;
      });

      currentTooltip.events.on('appeared', function () {
        const dataItem = tooltip.dataItem;
        if (dataItem && dataItem.dataContext) {
          const data = dataItem.dataContext;
          const buttonId = `detail-button-${data.region.replace(/\s+/g, '-').toLowerCase()}`;

          // Add click event listener to the button after the tooltip is rendered
          setTimeout(() => {
            const detailButton = document.getElementById(buttonId);
            if (detailButton) {
              detailButton.addEventListener('click', function () {
                showDetails(data);
                tooltip.hide();
              });
            }
          }, 100);
        }
      });

      // Process marker data
      const processedData = markerData.map((item) => {
        let circleSettings = {};
        let iconSettings = {};

        if (item.status === 'low') {
          circleSettings = {
            // fill: am5.color(0x5ad8a6)
          };
          iconSettings = {
            scale: 4,
            src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0MCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8xNzlfMjcwNykiPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjE2IiByPSIxMS41IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjNTBDRDg5Ii8+CjxwYXRoIG9wYWNpdHk9IjAuMyIgZD0iTTIwIDIyLjY2NjdDMjMuNjgxOSAyMi42NjY3IDI2LjY2NjcgMTkuNjgxOSAyNi42NjY3IDE2QzI2LjY2NjcgMTIuMzE4MSAyMy42ODE5IDkuMzMzMzQgMjAgOS4zMzMzNEMxNi4zMTgxIDkuMzMzMzQgMTMuMzMzMyAxMi4zMTgxIDEzLjMzMzMgMTZDMTMuMzMzMyAxOS42ODE5IDE2LjMxODEgMjIuNjY2NyAyMCAyMi42NjY3WiIgZmlsbD0iIzUwQ0Q4OSIvPgo8cGF0aCBkPSJNMjIuMTczMyAxMi45NEMyMS44NzEyIDEyLjgzNTUgMjEuNTUwOSAxMi43OTQgMjEuMjMyMiAxMi44MTgxQzIwLjkxMzQgMTIuODQyMiAyMC42MDMgMTIuOTMxMyAyMC4zMiAxMy4wOEMyMC4yMTg3IDEzLjEzODUgMjAuMTAzNyAxMy4xNjkzIDE5Ljk4NjcgMTMuMTY5M0MxOS44Njk2IDEzLjE2OTMgMTkuNzU0NyAxMy4xMzg1IDE5LjY1MzMgMTMuMDhDMTkuMTQ0NiAxMi44MTQzIDE4LjU1NTEgMTIuNzQ3NyAxOCAxMi44OTMzQzE3LjU0MTIgMTMuMDExNCAxNy4xMzQ2IDEzLjI3ODQgMTYuODQzOCAxMy42NTI0QzE2LjU1MzEgMTQuMDI2NCAxNi4zOTQ2IDE0LjQ4NjMgMTYuMzkzMyAxNC45NkMxNi4zOTMzIDE3LjIyNjcgMTguNTkzMyAxOC41NTMzIDE5LjU2NjcgMTkuMDJDMTkuNzA4NCAxOS4wODI3IDE5Ljg2MTcgMTkuMTE1IDIwLjAxNjcgMTkuMTE1QzIwLjE3MTcgMTkuMTE1IDIwLjMyNDkgMTkuMDgyNyAyMC40NjY3IDE5LjAyQzIxLjQyNjcgMTguNjIgMjMuNTczMyAxNy40NDY3IDIzLjYyIDE0LjkwNjdDMjMuNjA3MiAxNC40NzA3IDIzLjQ2MTkgMTQuMDQ5IDIzLjIwMzUgMTMuNjk3N0MyMi45NDUgMTMuMzQ2MyAyMi41ODU3IDEzLjA4MiAyMi4xNzMzIDEyLjk0WiIgZmlsbD0iIzUwQ0Q4OSIvPgo8cmVjdCB4PSIxOS41IiB5PSIyOCIgd2lkdGg9IjEiIGhlaWdodD0iOCIgZmlsbD0iI0Y0RjZGQSIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMTc5XzI3MDciIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0OCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR5PSI0Ii8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjQiLz4KPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0Ii8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3dfMTc5XzI3MDciLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMTc5XzI3MDciIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg=='
          };
        } else if (item.status === 'alert') {
          circleSettings = {};
          iconSettings = {
            scale: 4,
            src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0MCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8xNzlfMjcxMSkiPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjE2IiByPSIxMS41IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjRjdDMDAwIi8+CjxwYXRoIG9wYWNpdHk9IjAuMyIgZD0iTTIwIDIyLjY2NjdDMjMuNjgxOSAyMi42NjY3IDI2LjY2NjcgMTkuNjgxOSAyNi42NjY3IDE2QzI2LjY2NjcgMTIuMzE4MSAyMy42ODE5IDkuMzMzMzQgMjAgOS4zMzMzNEMxNi4zMTgxIDkuMzMzMzQgMTMuMzMzMyAxMi4zMTgxIDEzLjMzMzMgMTZDMTMuMzMzMyAxOS42ODE5IDE2LjMxODEgMjIuNjY2NyAyMCAyMi42NjY3WiIgZmlsbD0iI0Y3QzAwMCIvPgo8cGF0aCBkPSJNMjAgMTYuOTMzM0MyMC4xNzY4IDE2LjkzMzMgMjAuMzQ2NCAxNi44NjMxIDIwLjQ3MTQgMTYuNzM4MUMyMC41OTY0IDE2LjYxMzEgMjAuNjY2NyAxNi40NDM1IDIwLjY2NjcgMTYuMjY2N1YxMy4xNkMyMC42NjY3IDEyLjk4MzIgMjAuNTk2NCAxMi44MTM2IDIwLjQ3MTQgMTIuNjg4NkMyMC4zNDY0IDEyLjU2MzYgMjAuMTc2OCAxMi40OTMzIDIwIDEyLjQ5MzNDMTkuODIzMiAxMi40OTMzIDE5LjY1MzYgMTIuNTYzNiAxOS41Mjg2IDEyLjY4ODZDMTkuNDAzNiAxMi44MTM2IDE5LjMzMzMgMTIuOTgzMiAxOS4zMzMzIDEzLjE2VjE2LjI2NjdDMTkuMzMzMyAxNi40NDM1IDE5LjQwMzYgMTYuNjEzMSAxOS41Mjg2IDE2LjczODFDMTkuNjUzNiAxNi44NjMxIDE5LjgyMzIgMTYuOTMzMyAyMCAxNi45MzMzWiIgZmlsbD0iI0Y3QzAwMCIvPgo8cGF0aCBkPSJNMjAgMTkuNTA2N0MyMC40NjAzIDE5LjUwNjcgMjAuODMzNCAxOS4xMzM2IDIwLjgzMzQgMTguNjczM0MyMC44MzM0IDE4LjIxMzEgMjAuNDYwMyAxNy44NCAyMCAxNy44NEMxOS41Mzk4IDE3Ljg0IDE5LjE2NjcgMTguMjEzMSAxOS4xNjY3IDE4LjY3MzNDMTkuMTY2NyAxOS4xMzM2IDE5LjUzOTggMTkuNTA2NyAyMCAxOS41MDY3WiIgZmlsbD0iI0Y3QzAwMCIvPgo8cmVjdCB4PSIxOS41IiB5PSIyOCIgd2lkdGg9IjEiIGhlaWdodD0iOCIgZmlsbD0iI0Y0RjZGQSIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMTc5XzI3MTEiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0OCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR5PSI0Ii8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjQiLz4KPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0Ii8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3dfMTc5XzI3MTEiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMTc5XzI3MTEiIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg=='
          };
        } else if (item.status === 'attention') {
          circleSettings = {};
          iconSettings = {
            scale: 4,
            src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA1NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8yODBfMzQ5MSkiPgo8Y2lyY2xlIGN4PSIyNy4wNTQ3IiBjeT0iMjEuMzU3MiIgcj0iMTUuMjE2IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjRjE0MTZDIiBzdHJva2Utd2lkdGg9IjEuMzIzMTMiLz4KPHBhdGggb3BhY2l0eT0iMC4zIiBkPSJNMjcuMDU0OCAzMC4xNzgzQzMxLjkyNjQgMzAuMTc4MyAzNS44NzU2IDI2LjIyOSAzNS44NzU2IDIxLjM1NzRDMzUuODc1NiAxNi40ODU3IDMxLjkyNjQgMTIuNTM2NSAyNy4wNTQ4IDEyLjUzNjVDMjIuMTgzMSAxMi41MzY1IDE4LjIzMzkgMTYuNDg1NyAxOC4yMzM5IDIxLjM1NzRDMTguMjMzOSAyNi4yMjkgMjIuMTgzMSAzMC4xNzgzIDI3LjA1NDggMzAuMTc4M1oiIGZpbGw9IiNGMTQxNkMiLz4KPHBhdGggZD0iTTI3LjA1NDYgMjQuMDAzNkMyNi44NzkyIDI0LjAwMzYgMjYuNzEwOSAyMy45MzM5IDI2LjU4NjggMjMuODA5OUMyNi40NjI4IDIzLjY4NTggMjYuMzkzMSAyMy41MTc1IDI2LjM5MzEgMjMuMzQyMVYyMi42MTg3QzI2LjM4NDggMjIuMTc2NiAyNi41MDEzIDIxLjc0MSAyNi43MjkgMjEuMzYyQzI2Ljk1NjggMjAuOTgyOSAyNy4yODY3IDIwLjY3NTYgMjcuNjgwOSAyMC40NzUzQzI3LjkxMiAyMC4zNjM0IDI4LjEwODkgMjAuMTkxOCAyOC4yNTEzIDE5Ljk3ODFDMjguMzkzNiAxOS43NjQ0IDI4LjQ3NjEgMTkuNTE2NiAyOC40OTAzIDE5LjI2MDJDMjguNTA0NCAxOS4wMDM5IDI4LjQ0OTYgMTguNzQ4NCAyOC4zMzE3IDE4LjUyMDRDMjguMjEzNyAxOC4yOTI0IDI4LjAzNjkgMTguMTAwMSAyNy44MTk1IDE3Ljk2MzVDMjcuNjAyMSAxNy44MjcgMjcuMzUyMSAxNy43NTExIDI3LjA5NTUgMTcuNzQzOEMyNi44Mzg4IDE3LjczNjUgMjYuNTg0OSAxNy43OTgxIDI2LjM2MDEgMTcuOTIyMUMyNi4xMzU0IDE4LjA0NjEgMjUuOTQ3OSAxOC4yMjggMjUuODE3MSAxOC40NDlDMjUuNjg2NCAxOC42Njk5IDI1LjYxNzMgMTguOTIxOSAyNS42MTY4IDE5LjE3ODZDMjUuNjE2OCAxOS4zNTQxIDI1LjU0NzEgMTkuNTIyMyAyNS40MjMxIDE5LjY0NjRDMjUuMjk5IDE5Ljc3MDUgMjUuMTMwNyAxOS44NDAyIDI0Ljk1NTMgMTkuODQwMkMyNC43Nzk4IDE5Ljg0MDIgMjQuNjExNSAxOS43NzA1IDI0LjQ4NzUgMTkuNjQ2NEMyNC4zNjM0IDE5LjUyMjMgMjQuMjkzNyAxOS4zNTQxIDI0LjI5MzcgMTkuMTc4NkMyNC4yOTUyIDE4Ljc3NDYgMjQuMzg1IDE4LjM3NTkgMjQuNTU2OSAxOC4wMTAzQzI0LjcyODcgMTcuNjQ0NyAyNC45Nzg1IDE3LjMyMTIgMjUuMjg4NiAxNy4wNjIzQzI1LjU5ODcgMTYuODAzNSAyNS45NjE3IDE2LjYxNTYgMjYuMzUyMSAxNi41MTE4QzI2Ljc0MjUgMTYuNDA4MSAyNy4xNTA5IDE2LjM5MSAyNy41NDg2IDE2LjQ2MThDMjguMTAzOSAxNi41NjYyIDI4LjYxNDEgMTYuODM3NSAyOS4wMTEyIDE3LjIzOTRDMjkuNDA4NCAxNy42NDEyIDI5LjY3MzYgMTguMTU0NiAyOS43NzE1IDE4LjcxMTFDMjkuODgyOCAxOS4zMDU4IDI5Ljc5NDMgMTkuOTIwNiAyOS41MTk5IDIwLjQ1OThDMjkuMjQ1NSAyMC45OTkxIDI4LjgwMDUgMjEuNDMyNSAyOC4yNTQzIDIxLjY5MjZDMjguMDg3MSAyMS43ODM2IDI3Ljk0ODMgMjEuOTE5MSAyNy44NTMzIDIyLjA4NDJDMjcuNzU4NCAyMi4yNDkyIDI3LjcxMDkgMjIuNDM3MiAyNy43MTYyIDIyLjYyNzZWMjMuMzUwOUMyNy43MTM5IDIzLjUyNDggMjcuNjQzMiAyMy42OTA4IDI3LjUxOTMgMjMuODEzQzI3LjM5NTUgMjMuOTM1MSAyNy4yMjg2IDI0LjAwMzYgMjcuMDU0NiAyNC4wMDM2VjI0LjAwMzZaIiBmaWxsPSIjRjE0MTZDIi8+CjxwYXRoIGQ9Ik0yNy4wNTQ2IDI2LjI4ODJDMjcuNDIgMjYuMjg4MiAyNy43MTYyIDI1Ljk5MiAyNy43MTYyIDI1LjYyNjdDMjcuNzE2MiAyNS4yNjEzIDI3LjQyIDI0Ljk2NTEgMjcuMDU0NiAyNC45NjUxQzI2LjY4OTMgMjQuOTY1MSAyNi4zOTMxIDI1LjI2MTMgMjYuMzkzMSAyNS42MjY3QzI2LjM5MzEgMjUuOTkyIDI2LjY4OTMgMjYuMjg4MiAyNy4wNTQ2IDI2LjI4ODJaIiBmaWxsPSIjRjE0MTZDIi8+CjxyZWN0IHg9IjI2LjM5MzMiIHk9IjM3LjIzNDciIHdpZHRoPSIxLjMyMzEzIiBoZWlnaHQ9IjEwLjU4NTEiIGZpbGw9IiNGNEY2RkEiLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kXzI4MF8zNDkxIiB4PSIwLjU5MjA2OSIgeT0iMC4xODcwODciIHdpZHRoPSI1Mi45MjUyIiBoZWlnaHQ9IjYzLjUxMDMiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeT0iNS4yOTI1MyIvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI1LjI5MjUzIi8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzI4MF8zNDkxIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzI4MF8zNDkxIiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo='
          };
        }

        return {
          geometry: { type: 'Point', coordinates: [item.longitude, item.latitude] },
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          region: item.region,
          value: item.value,
          change: item.change,
          circleSettings: circleSettings,
          iconSettings: iconSettings
        };
      });

      pointSeries.data.setAll(processedData);

      // Add zoom controls
      chart.set(
        'zoomControl',
        am5map.ZoomControl.new(root, {
          x: am5.percent(100),
          centerX: am5.percent(100),
          y: am5.percent(100),
          centerY: am5.percent(100)
        })
      );

      // Add click event to close tooltip when clicking elsewhere on the map
      chart.events.on('click', function (ev) {
        // Check if the click is not on a marker
        if (ev.target === chart || ev.target === polygonSeries.mapPolygons.template) {
          tooltip.hide();
        }
      });

      // Make map responsive
      chart.appear(1000, 100);
    });

    onUnmounted(() => {
      if (root) {
        root.dispose();
      }
    });

    return {
      chartDiv,
      showDetailModal,
      selectedRegion,
      closeModal
    };
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 700px;
  background-color: #67b7dc;
  border-radius: 8px;
  overflow: hidden;
}

.chart-div {
  width: 100%;
  height: 100%;
}

.legend {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: white;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.marker {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.marker.low {
  background-color: #5ad8a6;
}

.marker.alert {
  background-color: #ffc233;
}

.marker.attention {
  background-color: #ff5c5c;
}

/* Modal styles */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.stat-item {
  margin-bottom: 16px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
}

.stat-value.positive {
  color: #5ad8a6;
}

.stat-value.low {
  color: #5ad8a6;
}

.stat-value.alert {
  color: #ffc233;
}

.stat-value.attention {
  color: #ff5c5c;
}

.chart-placeholder {
  margin-top: 24px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.chart-placeholder h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
}

.mini-chart {
  height: 150px;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}

.mini-chart::after {
  content: 'Historical data chart would appear here';
  font-size: 14px;
}

.status-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.status-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.low {
  background-color: rgba(90, 216, 166, 0.1);
  color: #5ad8a6;
}

.icon-wrapper.alert {
  background-color: rgba(255, 194, 51, 0.1);
  color: #ffc233;
}

.icon-wrapper.attention {
  background-color: rgba(255, 92, 92, 0.1);
  color: #ff5c5c;
}

.status-text {
  display: flex;
  flex-direction: column;
}

.status-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a1a;
}

.status-subtitle {
  font-size: 0.8rem;
  color: #666;
}

.status-value {
  display: flex;
  text-align: right;
}

.percentage {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.2;
}

.fraction {
  font-size: 0.8rem;
  color: #666;
  margin-top: 1rem;
}
</style>
