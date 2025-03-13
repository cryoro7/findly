<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { HeartIcon, AlertSquareRoundedIcon, MailboxIcon, PhotoIcon } from 'vue-tabler-icons';

// imported components
import Map from './components/Map.vue';

const { proxy } = getCurrentInstance();
const isMap = ref(false);
const pointers = ref([]);
const toggleNilai = ref(['0-30', '31-60', '61-100000']);

onMounted(() => {
  getDataMap();
});

const coloring = (nilai) => {
  let color = null;
  if (nilai < 30) {
    color = 0xff0000;
  } else if (nilai > 61) {
    color = 0xa3cf39;
  } else {
    color = 0xf99500;
  }
  return color;
};

async function getDataMap() {
  let dataSummary = [
    {
      id: 'KANTOR_PUSAT',
      name: 'KANTOR PUSAT',
      percentage: 0,
      status: 'RED'
    },
    {
      id: 'KANWIL_BALIKPAPAN',
      name: 'KANWIL BALIKPAPAN',
      percentage: 11,
      status: 'RED'
    },
    {
      id: 'KANWIL_BANDUNG',
      name: 'KANWIL BANDUNG',
      percentage: 10,
      status: 'RED'
    },
    {
      id: 'KANWIL_DENPASAR',
      name: 'KANWIL DENPASAR',
      percentage: 9,
      status: 'RED'
    },
    {
      id: 'KANWIL_JAKARTA_1',
      name: 'KANWIL JAKARTA 1',
      percentage: 10,
      status: 'RED'
    },
    {
      id: 'KANWIL_JAKARTA_2',
      name: 'KANWIL JAKARTA 2',
      percentage: 8,
      status: 'RED'
    },
    {
      id: 'KANWIL_MAKASSAR',
      name: 'KANWIL MAKASSAR',
      percentage: 10,
      status: 'RED'
    },
    {
      id: 'KANWIL_MANADO',
      name: 'KANWIL MANADO',
      percentage: 9,
      status: 'RED'
    },
    {
      id: 'KANWIL_MEDAN',
      name: 'KANWIL MEDAN',
      percentage: 13,
      status: 'RED'
    },
    {
      id: 'KANWIL_PALEMBANG',
      name: 'KANWIL PALEMBANG',
      percentage: 9,
      status: 'RED'
    },
    {
      id: 'KANWIL_PEKANBARU',
      name: 'KANWIL PEKANBARU',
      percentage: 9,
      status: 'RED'
    },
    {
      id: 'KANWIL_SEMARANG',
      name: 'KANWIL SEMARANG',
      percentage: 10,
      status: 'RED'
    },
    {
      id: 'KANWIL_SURABAYA',
      name: 'KANWIL SURABAYA',
      percentage: 11,
      status: 'RED'
    }
  ];

  let dataPoint = [
    {
      latitude: 3.6426141,
      longitude: 98.5043398,
      title: 'KANWIL MEDAN',
      nilai: 13,
      color: 16711680,
      data: {
        label: 'KANWIL MEDAN',
        totalNasabah: 7701,
        totalPelangganOrganik: 13,
        totalPelangganNonOrganik: 997,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 1524
      }
    },
    {
      latitude: -8.672482,
      longitude: 115.068551,
      title: 'KANWIL DENPASAR',
      nilai: 9,
      color: 16711680,
      data: {
        label: 'KANWIL DENPASAR',
        totalNasabah: 10393,
        totalPelangganOrganik: 28,
        totalPelangganNonOrganik: 939,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 1624
      }
    },
    {
      latitude: -6.2578962,
      longitude: 106.8063399,
      title: 'KANWIL JAKARTA 2',
      nilai: 8,
      color: 16711680,
      data: {
        label: 'KANWIL JAKARTA 2',
        totalNasabah: 9274,
        totalPelangganOrganik: 51,
        totalPelangganNonOrganik: 709,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 2177
      }
    },
    {
      latitude: 1.5409856,
      longitude: 124.7019135,
      title: 'KANWIL MANADO',
      nilai: 9,
      color: 16711680,
      data: {
        label: 'KANWIL MANADO',
        totalNasabah: 9267,
        totalPelangganOrganik: 6,
        totalPelangganNonOrganik: 835,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 1351
      }
    },
    {
      latitude: -5.1113132,
      longitude: 119.3200546,
      title: 'KANWIL MAKASSAR',
      nilai: 10,
      color: 16711680,
      data: {
        label: 'KANWIL MAKASSAR',
        totalNasabah: 10815,
        totalPelangganOrganik: 10,
        totalPelangganNonOrganik: 1036,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 1557
      }
    },
    {
      latitude: -2.954794,
      longitude: 104.6803916,
      title: 'KANWIL PALEMBANG',
      nilai: 9,
      color: 16711680,
      data: {
        label: 'KANWIL PALEMBANG',
        totalNasabah: 6546,
        totalPelangganOrganik: 14,
        totalPelangganNonOrganik: 598,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 1104
      }
    },
    {
      latitude: -7.0245522,
      longitude: 110.3344923,
      title: 'KANWIL SEMARANG',
      nilai: 10,
      color: 16711680,
      data: {
        label: 'KANWIL SEMARANG',
        totalNasabah: 16932,
        totalPelangganOrganik: 58,
        totalPelangganNonOrganik: 1580,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 2212
      }
    },
    {
      latitude: -6.9033625,
      longitude: 107.601872,
      title: 'KANWIL BANDUNG',
      nilai: 10,
      color: 16711680,
      data: {
        label: 'KANWIL BANDUNG',
        totalNasabah: 13386,
        totalPelangganOrganik: 40,
        totalPelangganNonOrganik: 1240,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 1368
      }
    },
    {
      latitude: -1.1744301,
      longitude: 116.759175,
      title: 'KANWIL BALIKPAPAN',
      nilai: 11,
      color: 16711680,
      data: {
        label: 'KANWIL BALIKPAPAN',
        totalNasabah: 7866,
        totalPelangganOrganik: 30,
        totalPelangganNonOrganik: 807,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 1539
      }
    },
    {
      latitude: -6.186186,
      longitude: 106.9536385,
      title: 'KANTOR PUSAT',
      nilai: 0,
      color: 16711680,
      data: {
        label: 'KANTOR PUSAT',
        totalNasabah: null,
        totalPelangganOrganik: null,
        totalPelangganNonOrganik: null,
        totalAkunPremium: null,
        BukaEmasDigital: null,
        BukaEmasLainnya: null,
        pelangganAktif: null
      }
    },
    {
      latitude: 0.5139623,
      longitude: 101.358603,
      title: 'KANWIL PEKANBARU',
      nilai: 9,
      color: 16711680,
      data: {
        label: 'KANWIL PEKANBARU',
        totalNasabah: 6388,
        totalPelangganOrganik: 15,
        totalPelangganNonOrganik: 560,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 1056
      }
    },
    {
      latitude: -7.2754417,
      longitude: 112.6301109,
      title: 'KANWIL SURABAYA',
      nilai: 11,
      color: 16711680,
      data: {
        label: 'KANWIL SURABAYA',
        totalNasabah: 23465,
        totalPelangganOrganik: 52,
        totalPelangganNonOrganik: 2466,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 2266
      }
    },
    {
      latitude: -6.2224022,
      longitude: 106.8080565,
      title: 'KANWIL JAKARTA 1',
      nilai: 10,
      color: 16711680,
      data: {
        label: 'KANWIL JAKARTA 1',
        totalNasabah: 12620,
        totalPelangganOrganik: 56,
        totalPelangganNonOrganik: 1169,
        totalAkunPremium: 133,
        BukaEmasDigital: 680,
        BukaEmasLainnya: 2305,
        pelangganAktif: 2392
      }
    }
  ];

  const data = dataPoint.map((item1) => {
    const match = dataSummary.find((item2) => item2.id === item1.id);
    return {
      latitude: item1.latitude,
      longitude: item1.longitude,
      title: item1.name,
      nilai: match?.percentage,
      color: coloring(match?.percentage),
      data: {
        label: item1.name,
        totalNasabah: item1.total,
        totalPelangganOrganik: item1.organic,
        totalPelangganNonOrganik: item1.nonOrganic,
        totalAkunPremium: item1.premium,
        BukaEmasDigital: item1.goldDigital,
        BukaEmasLainnya: item1.goldOther,
        pelangganAktif: item1.activeTransaction
      }
    };
  });
  pointers.value = data;
  console.log('🚀 ~ pointers.value=dataMap.map ~ pointers:', data);
}

const lowCardStyle = ref({
  backgroundColor: '#e0f7fa', // Light green
  borderRadius: '12px'
});
const alertCardStyle = ref({
  backgroundColor: '#fff9c4', // Light yellow
  borderRadius: '12px'
});
const attentionCardStyle = ref({
  backgroundColor: '#f8bbd0', // Light pink
  borderRadius: '12px'
});
</script>

<template>
  <v-row>
    <v-col cols="12" lg="12">
      <v-card>
        <Map :pointers="pointers" :toggleNilai="toggleNilai" />
        <v-row class="pa-4" justify="center">
          <!-- Low Card -->
          <v-col cols="12" sm="4">
            <v-card flat class="metric-card pa-4" max-width="400">
              <div class="d-flex align-start">
                <div class="icon-wrapper">
                  <img src="../../../assets/images/icons/heart_logo.svg" />
                </div>

                <div style="margin-right: auto" class="ml-3">
                  <div class="d-flex flex-column">
                    <div class="title-wrapper">
                      <span class="text-subtitle-1 font-weight-medium">Low</span>
                    </div>
                    <span class="area-label">Area</span>
                  </div>
                </div>
                <div class="mt-2 d-flex align-center">
                  <span class="percentage">10%</span>
                  <span class="fraction ml-2">10/200</span>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Alert Card -->
          <v-col cols="12" sm="4">
            <v-card flat class="metric-card pa-4" max-width="400">
              <div class="d-flex align-start">
                <div class="icon-wrapper">
                  <img src="../../../assets/images/icons/alert_logo.svg" />
                </div>

                <div style="margin-right: auto" class="ml-3">
                  <div class="d-flex flex-column">
                    <div class="title-wrapper">
                      <span class="text-subtitle-1 font-weight-medium">Alert</span>
                    </div>
                    <span class="area-label">Area</span>
                  </div>
                </div>
                <div class="mt-2 d-flex align-center">
                  <span class="percentage">10%</span>
                  <span class="fraction ml-2">10/200</span>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Attention Card -->
          <v-col cols="12" sm="4">
            <v-card flat class="metric-card pa-4" max-width="400">
              <div class="d-flex align-start">
                <div class="icon-wrapper">
                  <img src="../../../assets/images/icons/attention_logo.svg" />
                </div>

                <div style="margin-right: auto" class="ml-3">
                  <div class="d-flex flex-column">
                    <div class="title-wrapper">
                      <span class="text-subtitle-1 font-weight-medium">Attention</span>
                    </div>
                    <span class="area-label">Area</span>
                  </div>
                </div>
                <div class="mt-2 d-flex align-center">
                  <span class="percentage">10%</span>
                  <span class="fraction ml-2">10/200</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<style scoped>
.metric-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.area-label {
  color: #757575;
  font-size: 0.875rem;
  line-height: 1.2;
}

.percentage {
  font-size: 1.5rem;
  font-weight: 600;
  color: #212121;
  line-height: 1;
}

.fraction {
  color: #757575;
  font-size: 0.775rem;
  margin-top: 10px;
}

.title-wrapper {
  line-height: 1.2;
}
</style>
