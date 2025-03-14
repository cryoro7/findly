<template>
  <v-container fluid>
    <v-card elevation="0">
      <v-card-title class="d-flex align-center pa-4">
        <v-btn @click="backPage" icon variant="text" class="me-2">
          <ChevronLeftIcon size="17" />
        </v-btn>
        <span class="text-body-1 font-weight-regular">Daftar ID Pelanggan Anomali - Wilayah NTT</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" class="mx-1"> <RefreshIcon size="17" /> </v-btn>
        <v-btn icon variant="text" class="mx-1">
          <PrinterIcon size="17" />
        </v-btn>
        <v-btn icon variant="text" class="mx-1">
          <DownloadIcon size="17" />
        </v-btn>
      </v-card-title>

      <v-data-table :hide-default-footer="true" :headers="headers" :items="customers">
        <template v-slot:item.no="{ index }">
          {{ index + 1 }}
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'Anomali' ? 'error' : 'grey-lighten-2'"
            :text-color="item.status === 'Anomali' ? 'white' : ''"
            size="small"
            class="px-4 rounded-pill"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn @click="showDetailModals(item)" color="#0093AE" size="small" variant="flat" class="text-white"> Graph </v-btn>
        </template>
      </v-data-table>

      <div class="d-flex align-center pa-4">
        <div class="text-body-2 text-grey">Showing {{ 1 }} to {{ Math.min(10, totalCustomers) }} of {{ totalCustomers }} entries</div>
        <v-spacer></v-spacer>
        <v-pagination v-model="page" :length="Math.ceil(totalCustomers / 10)" :total-visible="5" rounded></v-pagination>
      </div>
    </v-card>
  </v-container>
  <div v-if="showDetailModal" class="detail-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>History Tagihan</h3>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>
      <div class="modal-body">
        <div class="chart-container">
          <div class="customer-info">
            <h3 class="customer-id">ID Pel: 523394XXXXXX</h3>
            <p class="customer-name">InXXXXXXXXXXa</p>
            <p class="last-updated">Last updated: {{ lastUpdated }}</p>
          </div>

          <div class="chart-wrapper">
            <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div style="place-self: center">
    <v-btn @click="backPage" color="#0093AE" size="small" variant="flat" class="text-white"> Back To Map </v-btn>
  </div>
</template>

<script setup>
import { router } from '@/router';
import { ref, computed, onMounted } from 'vue';
import { ChevronLeftIcon, DownloadIcon, PrinterIcon, RefreshIcon } from 'vue-tabler-icons';
import VueApexCharts from 'vue3-apexcharts';

const showDetailModal = ref(false);

// Table headers
const headers = [
  { title: 'No.', key: 'no', align: 'start', width: '5%' },
  { title: 'ID Pelanggan', key: 'id', align: 'start', width: '20%' },
  { title: 'Customer Name', key: 'name', align: 'start', width: '35%' },
  { title: 'Status', key: 'status', align: 'start', width: '20%' },
  { title: 'Action', key: 'action', align: 'center', width: '20%' }
];

// Customer data
const customers = ref([
  { id: '523394XXXXXX', name: 'BaXXXXXXXXXn', status: 'Normal' },
  { id: '523394XXXXXX', name: 'InXXXXXXXXXXa', status: 'Anomali' },
  { id: '523394XXXXXX', name: 'ChXXXXXXXXXXri', status: 'Normal' },
  { id: '523394XXXXXX', name: 'RiXXXXXXXXXXra', status: 'Normal' },
  { id: '523394XXXXXX', name: 'AlXXXXXXXXXXan', status: 'Normal' },
  { id: '523394XXXXXX', name: 'FaXXXXXXXXXXa', status: 'Normal' },
  { id: '523394XXXXXX', name: 'RioXXXXXXXXXno', status: 'Normal' },
  { id: '523394XXXXXX', name: 'GaXXXXXXXXXXo', status: 'Normal' }
]);

// Data for the chart
const billingData = ref([
  { month: '07/2023', amount: 127214537 },
  { month: '08/2023', amount: 47214537 },
  { month: '09/2023', amount: 27214537 },
  { month: '10/2023', amount: 57214537 },
  { month: '11/2023', amount: 157214537 },
  { month: '12/2023', amount: 87214537 }
]);

const lastUpdated = ref('09:02:32');

// Format currency to Indonesian Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
    .format(value)
    .replace('IDR', 'Rp');
};

// Format short currency (for y-axis)
const formatShortCurrency = (value) => {
  return `Rp ${value.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
};

// Prepare series data for ApexCharts
const series = ref([
  {
    name: 'Tagihan (Rp)',
    data: billingData.value.map((item) => item.amount)
  }
]);

// Chart configuration
const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    },
    fontFamily: 'Arial, sans-serif'
  },
  colors: ['#0096c7'],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  grid: {
    borderColor: '#e0e0e0',
    row: {
      colors: ['transparent'],
      opacity: 0.5
    }
  },
  markers: {
    size: 6,
    colors: ['#0096c7'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: {
      size: 8
    }
  },
  xaxis: {
    categories: billingData.value.map((item) => item.month),
    labels: {
      style: {
        colors: '#666',
        fontSize: '12px'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    min: 0,
    max: 200000000,
    tickAmount: 8,
    labels: {
      formatter: (value) => {
        if (value === 0) return 'Rp 0';
        if (value === 25000000) return 'Rp 25.000.000';
        if (value === 50000000) return 'Rp 50.000.000';
        if (value === 75000000) return 'Rp 75.000.000';
        if (value === 100000000) return 'Rp 100.000.000';
        if (value === 125000000) return 'Rp 125.000.000';
        if (value === 150000000) return 'Rp 150.000.000';
        if (value === 175000000) return 'Rp 175.000.000';
        if (value === 200000000) return 'Rp 200.000.000';
        return '';
      },
      style: {
        colors: '#666',
        fontSize: '12px'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (value) => {
      return `Rp ${value.toLocaleString('id-ID')}`;
    },
    style: {
      fontSize: '10px',
      colors: ['#0096c7'],
      fontWeight: 'bold'
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      borderRadius: 4,
      padding: 4,
      opacity: 0.9,
      borderWidth: 1,
      borderColor: '#0096c7'
    },
    offsetY: -15
  },
  tooltip: {
    enabled: true,
    formatter: function (val, opts) {
      return formatCurrency(val);
    },
    style: {
      fontSize: '12px'
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    labels: {
      colors: '#666'
    }
  }
}));

// Methods
const closeChart = () => {
  // Implement close functionality
  console.log('Chart closed');
};

const backPage = () => {
  router.go(-1);
};

onMounted(() => {
  // Any initialization code can go here
});

// Pagination
const page = ref(1);
const totalCustomers = ref(50);

const showDetailModals = (dataItem) => {
  showDetailModal.value = true;
};

const closeModal = () => {
  showDetailModal.value = false;
};
</script>

<style scoped>
.v-data-table :deep(th) {
  background-color: #f5f5f5 !important;
  color: rgba(0, 0, 0, 0.6) !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
}

.v-data-table :deep(td) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

.v-pagination :deep(.v-pagination__item--active) {
  background-color: #1976d2 !important;
  color: white !important;
}

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
  max-width: 1100px;
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
  /* padding: 20px; */
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

.chart-container {
  font-family: Arial, sans-serif;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  max-width: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: #f5f5f5;
}

.customer-info {
  margin: 16px 0;
}

.customer-id {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.customer-name {
  font-size: 14px;
  color: #666;
  margin: 0 0 4px 0;
}

.last-updated {
  font-size: 12px;
  color: #999;
  text-align: right;
  margin: 0;
}

.chart-wrapper {
  margin-top: 16px;
}
</style>
