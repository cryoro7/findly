<template>
  <div>
    <div id="map" style="width: 100%; height: 500px"></div>
    <div id="html-tooltip" class="html-tooltip"></div>
  </div>
</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_indonesiaLow from '@amcharts/amcharts5-geodata/indonesiaLow';

export default {
  data() {
    return {
      sumutRegions: [
        'Riau',
        'Kalbar',
        'Kaltimra',
        'Sumbar',
        'Sultrengoo',
        'SZJB',
        'Jakarta',
        'Jabar',
        'Jateng',
        'Jatin',
        'Bali',
        'NTB',
        'NTT'
      ],
      papuaRegions: ['Maluku', 'Malku', 'NTT'],
      markers: [
        { name: 'Riau', latitude: 0.2933, longitude: 101.7068, jumlah: 20 },
        { name: 'Kalbar', latitude: -0.0263, longitude: 109.3425, jumlah: 20 },
        { name: 'Kaltimra', latitude: -0.5022, longitude: 117.1536, jumlah: 20 },
        { name: 'Sumbar', latitude: -0.95, longitude: 100.3531, jumlah: 20 },
        { name: 'Sultrengoo', latitude: -3.7928, longitude: 122.2653, jumlah: 20 },
        { name: 'SZJB', latitude: -6.2088, longitude: 106.8456, jumlah: 20 },
        { name: 'Jakarta', latitude: -6.2088, longitude: 106.8456, jumlah: 20 },
        { name: 'Jabar', latitude: -6.9147, longitude: 107.6098, jumlah: 20 },
        { name: 'Jateng', latitude: -7.0051, longitude: 110.4381, jumlah: 20 },
        { name: 'Jatin', latitude: -7.2575, longitude: 112.7521, jumlah: 20 },
        { name: 'Bali', latitude: -8.4095, longitude: 115.1889, jumlah: 20 },
        { name: 'NTB', latitude: -8.6529, longitude: 117.3616, jumlah: 20 },
        { name: 'NTT', latitude: -8.6574, longitude: 121.0794, jumlah: 20 },
        { name: 'Maluku', latitude: -3.2385, longitude: 130.1453, jumlah: 20 }
        // { name: "NTT", latitude: -8.6574, longitude: 121.0794 },
      ]
    };
  },
  mounted() {
    this.createMap();
  },
  methods: {
    createMap() {
      let root = am5.Root.new('map');

      let chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'none', // Disable panning
          panY: 'none', // Disable panning
          wheelX: 'none', // Disable wheel zoom
          wheelY: 'none', // Disable wheel zoom
          pinchZoom: false, // Disable pinch zoom
          projection: am5map.geoMercator()
        })
      );

      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_indonesiaLow,
          exclude: ['AQ']
        })
      );

      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xaaaaaa),
        strokeWidth: 0.5,
        stroke: am5.color(0xffffff)
      });

      let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
      let htmlTooltip;
      htmlTooltip = document.getElementById('html-tooltip');
      //     this.markers.forEach((marker) => {
      //       pointSeries.data.push({
      //         geometry: {
      //           type: 'Point',
      //           coordinates: [marker.longitude, marker.latitude]
      //         },
      //         name: marker.name
      //       });
      //       pointSeries.bullets.push(function () {
      //         return am5.Bullet.new(root, {
      //           sprite: am5.Picture.new(root, {
      //             src: 'data:image/png;base64,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', // URL to your icon
      //             width: 50,
      //             height: 50,
      //             x: am5.percent(30),
      //             y: am5.percent(50),
      //             centerX: am5.percent(50),
      //             centerY: am5.percent(50),
      //             tooltipHTML:
      //               `<table style="background-color: rgba(0, 0, 0, 0.75);color: black;border-left: 3px solid red;
      // margin-right: 3px;"  cellpadding=0 cellspacing=0>` +
      //               `<tr><td style='font-size:10px;border-left: 4px solid #${marker.name};padding-left:10px;'>${marker.name}</td></tr>` +
      //               `<tr><td style='font-size:9.3px;color:#b5b6b6;border-left: 4px solid #${marker.name};padding-left:10px;'>Total Nasabah</td></tr>` +
      //               `<tr><td style='border-left: 4px solid #${marker.name};padding-left:10px;'>${marker.name}</td></tr>` +
      //               `<tr><td style='font-size:9.3px;color:#b5b6b6;border-left: 4px solid #${marker.name};padding-left:10px;'>Pelanggan Digital Organik</td></tr>` +
      //               `</table>`
      //           })
      //         });
      //       });

      //       // const animation = circle.animate({
      //       //   key: 'radius',
      //       //   to: 5,
      //       //   duration: 1000,
      //       //   easing: am5.ease.out(am5.ease.cubic),
      //       //   loops: Infinity,
      //       //   yoyo: true
      //       // });
      //     });
      // pointSeries.bullets.push(function () {
      //   return am5.Bullet.new(root, {
      //     sprite: am5.Picture.new(root, {
      //       src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAwCAYAAABjezibAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAkeSURBVHgB7VldbFxHFT73b3f97zh1HCdOYjcOIbGI07jUVYRcRzyUCoLETwQtKTxBGqjEA0RFUHCiQpEKLzxAVYpUoUrkIQKJRghCEEQI1CTELaHEJcS4brLpsuva3h9vvHv/hnNmZ+7Ovd41dpSmatUjjebu3LlzvvnOnDNnZgHercIY08Sjhs/Rd7X6vfWighLANPl89OhRHWtd1Gqb7AfRidxSYBKMqEmxceDAAQNrs0YJ3olaApclOuG6slL6eT9Uotb6qb0Pr9ljtTxq6foI/u7Fxi2ifxa5uugw92S6vPDrL9ivvj4+Pk70+eJ7KowY1TSN/V/F9UTOEAdRTatPjBzq3WBYz+pNDfdZHxkGY3AbGP0bQV+/lnfy/zuLZQ6cU+fA/fsVsFMzz2fY4hMPF1+ZRqAEUgXFIr9XLJo07ejoqEkF22KpkUNfz+8/Mr/43G+YXyiylQj1ze17dD498sjXaAwQy4DMfrNOJBc/X2tYLCzxzOgj3y189jvMS73JViv0TR6/zYwcfoJADg0NWbQ+xRpdNUi5qDm4/v7+eOq+Lx25WXBRkGSF3t7ehGSS9LFqRFhemDCrmBkxlzi95zM7yET1wPm5Bea/8SZzryR58a6mGSvZdUHmPn4ke3rPJ3aQVRSQNQHq0Qbyh2PHjmlTU1M6MsdZ3N269luxzz/QLp0gENcH//JV8C69Bt50CtjMPC9+MgPuS5fBn7wOUHbCCnGM+CdH24Zaup8RwDiDSIjEEgKpRdkTHivjlfHC4Kfu3Ldj4J/Nx4+FwaFiAsbKNiwnWjwGxq6tyJNR1bOwCAsPjcHTr/5t02OTZ2Z37tzpTUxMkHf7FRjV8GOq4Ig5GhMXsIbhgAMcbFuz39i9bYli/1omBM6fL4D7xwsAizZYH9sLWntLZVzs4/3nOhjbN1dBNzeAdf8wPDSf+8oPc5e+h+B4qKH4CJWoFoSdkIlFB0BwWnd3N2exWY99lAaLsuejKUNNPzsJgKC0O7uhRM+KsLk8sHwx1GbipBtN80MzMzO61HXmzBlyzgqFUYAyFmO809DDdNd1OYOGpn3AWN8RGtzPhMGxUhn07rUQ+/DdYO3dxVmktlCfYin0W9+KgV3TiFYjlUrxPRsBahUowcYQYpC/zGQy+vT0tO55Hp+VBlqbFnGO6LrTEnGIH7yfgyIm9b5u3rYsQBxThwpA+tnT08P1o7NU+gsSA88haok927Z5x7m5OQ1qePly4k1MY1CKQezTo7AaaW9v15PJJNd74sSJCiDBogQQ2HxycpK/b2tr05uamnSXsSTDvVUVramhtiY0rdG3YQl7/Ju4FfrN92tcmajDyGazkgzaVmU8DHmxJj0IqabZQC6X478d5iW9yes9pmJmrSlRE58x9D6AUu2wo61rD/1m6Tko+95EsVgMckpqF+sQJMioCRmCk2xqjY2NWs4tv+hevBJW1toEWkdrFAM3Me4US8F1tvN4qIr9u3OQsYu/V8GEgETWIFM6qjU8Pvnic5Q2UXBVxUAvhIjZzD3bwdzRF2qjPvqmdRAV9+IkvDA7dVoBx3ViDK4AEI6sq2jR/vyhs7OT1zdu3GAn0v8qFHP5c/Yv/xTWgDuDMdDH2aknWkcL7iL9S9gr//y3MHst+avH//3XJK7BkE6MwSBiYXgwkb2YlLlg3YxlDX7chfWWb/TeOzq//0jeS83WThZKZZ4gBMnCGzPMzy7USRZm2dzol/Pf3Dq8D8emMEM61iBA0imTB3muqU5WAhSdmrC0YSHbbMLSf/aDDz5ZeHCM1QO5EqFv8zjG+eHPPYlj4gYNPaQDw0y70ClTsJqZDTWYuHGTPRqxkBfcgWUDFlpY73/p3oM/uVmQEtzLwwd/jGNtTyQSfeiENDaFh1aMHg1Ct6GcDMFQAWIU5/GRdhJlFjIl0p5J/mP8gcT6G20nz+7SNT1u1kgiokLOZR//AxSfer5w6drUj+45f/xZbMad1HVisZiLIN1yuezl83mG+zJfeBhqgnNLlMYgzYJqIhkThUxPbmsd7rlr81e37D68cfPm/cZgP8Tw4KTjfq11VWIlS88Cxk5+YHJOnYdsdn78+6+d/fbTyVeuxuNxGwE5CKyMTkjJoiweVNItWcMSgEStCNjBeRd3FBODtqUANQVQ84sbBzcd3LB9tDfRtq/FsLYZms5zLAzAqUXfTaXt4oXHLv/5F38pprOO47gIzkELOaVSyWlubrYNw3BwbAfN67W2tlJOqIKryWCw5RBITIMMHMxCc5i+75sY9WO4dkxqQ/NwhnHvDhb1+QsvH6JB7rn7rp9alsUTUATmCVZcUWyFNRd1uJjNeApzTAVYKxmQnXycsY+AnEKh4Oq67mLYsYkBUiKEPyNYrsw0Tc/QDfrekULPZFYByMYxeFtHRweB9RCcj8E5AMYq8a92wsqqwZFR0EZn8WkAUo4gHWTQRbPYuH5swYQtwZJlCaAVs0hxWRTeLidFBcfgk8FsibOGnuvTrQPdNJBeJRVcClCKSL34gsXZ8YHIFDTzhYUFhxY3sdnQ0GCrQCzT8qgo4EvYh9ZcOWLawKQDAwO8lgAhsieHAIqzABsbGwtm1NLSwmiWxKQA6Qom7MXFxTIBpd8EhMIGFXyWgHgfBZj8Xk48uKthq7n5Ysq1mnKDxQ/wFFC7uroo6pPH0g5AsaUTy7rXr6Wemr56/QfoobQD3SHeUZ9W8Q3tFPxWQYxpsOqtWU0sZq1GYlJ8oJ6wGIJjGESZePYxnjE8Gvi4nrjno+d6uDNrtAwEO4HDpdNpnyxBx0tx0yXXnFRUE2DdlF75wEewfI1QxoGMcvNQ3ELzUmzjZsN3Dno6MwyTezEIU1KNzPM1p8Q5NZzcmhtYxey6anao7DBkOjoHNIo6IQq9o+BuiW/4AQmWMWlUVnwokqZg1ZGlmbi30+2AePaRMe5Y9EyMUy0OQ/Q5Z6+eSW+VhK7nxN2hSYtfdQBRgutf9lbdUdcDx5T7alD2b6jeURvK3XRwmb4aWdW5V0gooMr7ZvkOn3lsQ5OqQVd66u2hEMJ/Qah/P3BWIzf6am55e0QN5FGwMhtW/y9hlUtRuN0SAhcFHXn/tkroZkDWbxdr78k7Tv4H5+Yp7d6eWtYAAAAASUVORK5CYII=', // Path to your local icon in public folder
      //       width: 50,
      //       height: 50,
      //       centerX: am5.p50,
      //       centerY: am5.p50
      //     })
      //   });
      // });

      this.markers.forEach((marker) => {
        pointSeries.data.push({
          geometry: {
            type: 'Point',
            coordinates: [marker.longitude, marker.latitude]
          },
          name: marker.name,
          jumlah: marker.jumlah
        });
      });

      pointSeries.bullets.push(function (root, series, dataItem) {
        let container = am5.Container.new(root, {
          cursorOverStyle: 'pointer',
        });
        // am5.Bullet.new(root, {
        //   sprite: am5.Picture.new(root, {
        //     src: 'data:image/png;base64,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', // Path to your local icon in public folder
        //     width: 50,
        //     height: 50,
        //     centerX: am5.p50,
        //     centerY: am5.p50
        //   })
        // });

        // if (dataItem.dataContext.data.nilai < 30) {
        let circle = container.children.push(
          am5.Circle.new(root, {
            radius: 7,
            fill: am5.color(0xff0000),
            interactive: true,
            stroke: am5.color(0xffffff),
            strokeOpacity: 0
          })
          // am5.Bullet.new(root, {
          //   sprite: am5.Picture.new(root, {
          //     src: 'data:image/png;base64,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', // Path to your local icon in public folder
          //     width: 50,
          //     height: 50,
          //     centerX: am5.p50,
          //     centerY: am5.p50
          //   })
          // })
        );

        // circle.animate({
        //   key: 'scale',
        //   from: 1,
        //   to: 5,
        //   duration: 2000,
        //   easing: am5.ease.out(am5.ease.cubic),
        //   loops: Infinity
        // });

        // circle.animate({
        //   key: 'opacity',
        //   from: 0.6,
        //   to: 0,
        //   duration: 2000,
        //   easing: am5.ease.out(am5.ease.cubic),
        //   loops: Infinity
        // });
        // }

        let circle2 = container.children.push(
          am5.Circle.new(root, {
            radius: 7,
            fill: am5.color(0xff0000),
            interactive: true,
            stroke: am5.color(0xffffff),
            strokeWidth: 1
          })
        );

         am5.Bullet.new(root, {
          sprite: am5.Picture.new(root, {
            src: 'data:image/png;base64,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', // Path to your local icon in public folder
            width: 50,
            height: 50,
            centerX: am5.p50,
            centerY: am5.p50
          })
        });

        circle2.events.on('pointerover', function () {
          circle2.animate({
            key: 'scale',
            to: 2.5,
            duration: 300,
            easing: am5.ease.out(am5.ease.cubic)
            //       tooltipHTML:
            //         `<table style="background-color: rgba(0, 0, 0, 0.75);color: black;border-left: 3px solid red;
            // margin-right: 3px;"  cellpadding=0 cellspacing=0>` +
            //         `<tr><td style='font-size:10px;border-left: 4px solid #${dataItem};padding-left:10px;'>${dataItem}</td></tr>` +
            //         `<tr><td style='font-size:9.3px;color:#b5b6b6;border-left: 4px solid #${dataItem};padding-left:10px;'>Total Nasabah</td></tr>` +
            //         `<tr><td style='border-left: 4px solid #${dataItem};padding-left:10px;'>${dataItem}</td></tr>` +
            //         `<tr><td style='font-size:9.3px;color:#b5b6b6;border-left: 4px solid #${dataItem};padding-left:10px;'>Pelanggan Digital Organik</td></tr>` +
            //         `</table>`
          });
          let popupdata = dataItem.dataContext;
          console.log('🚀 ~ dataItem:', dataItem);
          htmlTooltip.innerHTML =
            `<table style="padding: 2%;background-color: #181C32;color: white;border-left: 3px solid red;margin-right: 3px;"  cellpadding=0 cellspacing=0>` +
            `<tr><td style='font-size:10px;border-left: 4px solid #${popupdata.name};padding-left:10px;'>Wilayah ${popupdata.name}</td></tr>` +
            `<tr><td style='border-left: 4px solid #${dataItem};padding-left:10px;'>${popupdata.jumlah} Anomali</td></tr>` +
            `<tr><td style='font-size:9.3px;color:#b5b6b6;border-left: 4px solid #${dataItem};padding-left:10px;'><div style="background:green">40%</div></td></tr>` +
            `<tr><td style='font-size:9.3px;color:#b5b6b6;border-left: 4px solid #${dataItem};padding-left:10px;'></td></tr>` +
            `</table>`;
          htmlTooltip.classList.add('visible');
        });

        circle2.events.on('globalpointermove', function (event) {
          htmlTooltip.style.left = event.point.x + 10 + 'px';
          htmlTooltip.style.top = event.point.y + 'px';
        });

        circle2.events.on('pointerout', function () {
          circle2.animate({
            key: 'scale',
            to: 1,
            duration: 300,
            easing: am5.ease.out(am5.ease.cubic)
          });
          htmlTooltip.classList.remove('visible');
        });

        return am5.Bullet.new(root, {
          sprite: container
        });
      });

      // pointSeries.bullets.push(function () {
      //   return am5.Bullet.new(root, {
      //     sprite: am5.Picture.new(root, {
      //       src: 'data:image/png;base64,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', // Path to your local icon in public folder
      //       width: 50,
      //       height: 50,
      //       centerX: am5.p50,
      //       centerY: am5.p50
      //     })
      //   });
      // });
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
::v-deep .am5-layer-30 {
  display: none !important;
}
.html-tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  /* padding: 10px; */
  border-radius: 5px;
  font-size: 11px;
  max-width: 255px;
  pointer-events: none;
  z-index: 1000;
  opacity: 0;
  transform: translateY(50px);
  transition:
    opacity 0.5s ease,
    transform 0.3s ease;
}
.html-tooltip.visible {
  opacity: 1;
  transform: translateY(0);
}

table.merah > tbody > tr > td {
  border-left: 3px solid red;
  margin-right: 3px;
}
</style>
