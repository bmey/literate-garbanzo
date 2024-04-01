import DrawControl from "@/components/DrawControl";
import { Filters } from "@/components/Filters";
import HospitalTooltip from "@/components/HospitalTooltip";
import { Select } from "@/components/Select";
import { theme } from "@/styles/theme";
import { MeasureFilter } from "@/types/filters";
import { Hospital } from "@/types/hospital";
import { MeasureGroups, MeasureType } from "@/types/measures";
import { measureNames } from "@/utils/measureNames";
import { formatNumber } from "@/utils/numbers";
import { MeasureStats, stats } from "@/utils/stats";
import collect from "@turf/collect";
import { promises as fs } from "fs";
import type { Feature, FeatureCollection, Polygon } from "geojson";
import { InferGetStaticPropsType } from "next";
import { Inter } from "next/font/google";
import { useCallback, useMemo, useState } from "react";
import Map, { CircleLayer, Layer, LayerProps, Source } from "react-map-gl";

const inter = Inter({ subsets: ["latin"] });

export const getStaticProps = async () => {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const hospitalsJson = await fs.readFile(
    process.cwd() + "/pages/api/hospitals.json",
    "utf8"
  );
  const measuresJson = await fs.readFile(
    process.cwd() + "/pages/api/measures.json",
    "utf8"
  );
  const hospitalList = Object.values(
    JSON.parse(hospitalsJson) as Record<string, Hospital>
  );
  const hospitals: FeatureCollection<any, Hospital> = {
    type: "FeatureCollection",
    features: hospitalList.map((hospital: Hospital) => ({
      type: "Feature",
      properties: hospital,
      geometry: { type: "Point", coordinates: [hospital.lon, hospital.lat] },
    })),
  };

  const globalStats = (Object.keys(MeasureType) as MeasureType[]).reduce(
    (result, type) => {
      result[type] = stats(hospitalList.map((h) => h[type]));
      return result;
    },
    {} as Record<MeasureType, MeasureStats>
  );

  return {
    props: {
      hospitals,
      mapboxToken,
      measures: JSON.parse(measuresJson) as MeasureGroups,
      globalStats,
    },
  };
};

const clusterProperties = (Object.keys(MeasureType) as MeasureType[]).reduce(
  (result, type) => {
    result[`${type}_sum`] = ["+", ["coalesce", ["get", type], 0]];
    return result;
  },
  {} as Record<`${MeasureType}_sum`, any>
);

export default function Home({
  hospitals,
  mapboxToken,
  measures,
  globalStats,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const initialViewState = {
    longitude: -102.4,
    latitude: 50.8,
    zoom: 1.5,
  };
  const [viewState, setViewState] = useState(initialViewState);
  const [selectedMeasure, setSelectedMeasure] = useState<MeasureType>(
    MeasureType.H_STAR_RATING
  );
  const [filters, setFilters] = useState<MeasureFilter[]>([]);
  const [popupInfo, setPopupInfo] = useState<Hospital | null>(null);
  const onClick = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      const features = e.features?.[0];
      if (
        features?.layer?.id === "points" &&
        popupInfo === null &&
        !features?.properties?.cluster
      ) {
        setPopupInfo(features?.properties as Hospital);
      } else {
        setPopupInfo(null);
      }
    },
    [setPopupInfo, popupInfo]
  );

  const [drawPolygonFeatures, setDrawPolygonFeatures] = useState<
    Record<string, Feature<Polygon>>
  >({});
  const onUpdatePolygon = useCallback((e: { features: any[] }) => {
    setDrawPolygonFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDeletePolygon = useCallback((e: { features: Feature[] }) => {
    setDrawPolygonFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id || ""];
      }
      return newFeatures;
    });
  }, []);

  const filteredHospitals = useMemo(() => {
    const result = hospitals.features.filter(
      (h) =>
        !!h.properties[selectedMeasure] &&
        filters.every((filter) => {
          if (
            !filter?.operation ||
            !filter?.type ||
            (!filter?.value && filter?.value !== 0)
          ) {
            return true;
          }
          const itemValue = h.properties[filter.type]!;
          switch (filter.operation) {
            case "!=":
              return itemValue != filter.value;
            case "<":
              return itemValue < filter.value;
            case "<=":
              return itemValue <= filter.value;
            case ">":
              return itemValue > filter.value;
            case ">=":
              return itemValue >= filter.value;
            case "=":
              return itemValue === filter.value;
          }
        })
    );
    return {
      ...hospitals,
      features: result,
    };
  }, [hospitals, selectedMeasure, filters]);

  const polygonAggregate = useMemo(() => {
    const polygons = Object.values(drawPolygonFeatures);
    if (!polygons.length) return undefined;

    const fCollection: FeatureCollection<Polygon> = {
      type: "FeatureCollection",
      features: polygons,
    };
    const collected = collect(
      fCollection,
      filteredHospitals,
      selectedMeasure,
      "values"
    );
    const values: (number | undefined)[] =
      collected.features[0].properties?.values || [];
    return stats(values);
  }, [drawPolygonFeatures, filteredHospitals, selectedMeasure]);

  const filteredGlobalStats = useMemo(
    () =>
      (Object.keys(MeasureType) as MeasureType[]).reduce((result, type) => {
        result[type] = stats(
          filteredHospitals.features.map((h) => h.properties[type])
        );
        return result;
      }, {} as Record<MeasureType, MeasureStats>),
    [filteredHospitals]
  );

  const layerStyle: CircleLayer = useMemo(() => {
    const targetStats = globalStats[selectedMeasure];
    return {
      id: "points",
      type: "circle",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 0, 23, 25],
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", selectedMeasure],
          targetStats.low,
          ["to-color", "#5b21b6"],
          targetStats.high,
          ["to-color", "#34d399"],
        ],
        "circle-stroke-color": [
          "interpolate",
          ["linear"],
          ["get", selectedMeasure],
          targetStats.low,
          ["to-color", "#2e1065"],
          targetStats.high,
          ["to-color", "#ecfdf5"],
        ],
        "circle-stroke-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4,
          0,
          23,
          6,
        ],
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 4, 0, 6, 1],
      },
    };
  }, [selectedMeasure, globalStats]);

  const clusterLayer: LayerProps = useMemo(() => {
    const targetStats = globalStats[selectedMeasure];
    return {
      id: "clusters",
      type: "circle",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "interpolate",
          ["linear"],
          ["/", ["get", `${selectedMeasure}_sum`], ["get", "point_count"]],
          targetStats.low,
          ["to-color", "#5b21b6"],
          targetStats.high,
          ["to-color", "#34d399"],
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        "circle-blur": 0.6,
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 1, 1, 23, 0],
      },
    };
  }, [selectedMeasure, globalStats]);

  return (
    <main className={`flex min-h-screen p-0 ${inter.className}`}>
      <div className="w-[20rem] min-w-[20rem] flex flex-col p-5 via-slate-950 from-slate-950 to-slate-900 bg-gradient-to-br border-r border-r-slate-800">
        <div className="border-b border-emerald-400 pb-3 mb-8 text-2xl bg-gradient-to-r to-pink-300 from-emerald-400 inline-block text-transparent bg-clip-text">
          <h1>Patient Satisfaction</h1>
        </div>
        <Select
          measures={measures}
          selected={selectedMeasure}
          onChange={setSelectedMeasure}
        />
        <Filters
          measures={measures}
          filters={filters}
          globalStats={globalStats}
          setFilters={setFilters}
        />
      </div>
      <div className="flex flex-col">
        <div className="h-[10rem] bg-slate-900 bg-gradient-to-br border-b border-b-slate-800 flex flex-col gap-1 px-5 py-3 justify-center overflow-y-clip overflow-x-auto max-w-[calc(100vw-20rem)]">
          <div className="text-sm text-slate-400 font-light">
            {measureNames[selectedMeasure]}
          </div>
          <div className="flex gap-5">
            <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1 min-w-32 relative">
              <div className="text-3xl text-emerald-500">
                {formatNumber(
                  polygonAggregate?.count ||
                    filteredGlobalStats[selectedMeasure].count
                )}
              </div>
              <div className="uppercase text-slate-300 text-xs tracking-tight">
                Hospitals
              </div>
              {!!polygonAggregate?.invalidCount && ( //TODO: show globalStats for invalid
                <div className="text-slate-500 text-[0.6rem] whitespace-nowrap bottom-2 absolute">
                  {formatNumber(polygonAggregate.invalidCount)} no response
                </div>
              )}
            </div>
            <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1">
              <div className="text-3xl text-slate-200">
                {formatNumber(
                  polygonAggregate?.avg ||
                    filteredGlobalStats[selectedMeasure].avg,
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </div>
              <div className="uppercase text-slate-300 text-xs tracking-tight">
                Avg
              </div>
            </div>
            <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1">
              <div className="text-3xl text-slate-200">
                {formatNumber(
                  polygonAggregate?.high ||
                    filteredGlobalStats[selectedMeasure].high,
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </div>
              <div className="uppercase text-slate-300 text-xs tracking-tight">
                High
              </div>
            </div>
            <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1">
              <div className="text-3xl text-slate-200">
                {formatNumber(
                  polygonAggregate?.low ||
                    filteredGlobalStats[selectedMeasure].low,
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </div>
              <div className="uppercase text-slate-300 text-xs tracking-tight">
                Low
              </div>
            </div>
            <div className="rounded-lg p-5 flex flex-col items-center justify-center border border-slate-700 gap-1">
              <div className="text-3xl text-slate-200">CHART</div>
              <div className="uppercase text-slate-300 text-xs tracking-tight">
                Pie chart here
              </div>
            </div>
          </div>
        </div>
        <Map
          {...viewState}
          initialViewState={initialViewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={onClick}
          reuseMaps
          mapboxAccessToken={mapboxToken}
          style={{
            width: "calc(100vw - 20rem)",
            height: "calc(100vh - 10rem)",
          }}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          attributionControl={false}
          interactiveLayerIds={["points"]}
        >
          <Source
            id="hospitals"
            type="geojson"
            data={filteredHospitals}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
            clusterProperties={clusterProperties}
          >
            <Layer {...layerStyle} />
            <Layer {...clusterLayer} />
          </Source>
          <DrawControl
            position="top-left"
            displayControlsDefault={false}
            controls={{
              polygon: true,
              trash: true,
            }}
            defaultMode="draw_polygon"
            onCreate={onUpdatePolygon}
            onUpdate={onUpdatePolygon}
            onDelete={onDeletePolygon}
          />
          {popupInfo && (
            <HospitalTooltip
              hospital={popupInfo}
              onClose={() => setPopupInfo(null)}
            />
          )}
        </Map>
      </div>
    </main>
  );
}
