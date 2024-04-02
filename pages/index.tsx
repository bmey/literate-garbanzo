import { SimpleBarChart, BarChartPoint } from "@/components/BarChart";
import { Filters } from "@/components/Filters";
import { HcahpsMap } from "@/components/HcahpsMap";
import { Select } from "@/components/Select";
import { Summary } from "@/components/Summary";
import { MeasureFilter } from "@/types/filters";
import { Hospital } from "@/types/hospital";
import { MeasureGroups, MeasureType } from "@/types/measures";
import { MeasureStats, stats } from "@/utils/stats";
import collect from "@turf/collect";
import { promises as fs } from "fs";
import type { Feature, FeatureCollection, Polygon } from "geojson";
import { InferGetStaticPropsType } from "next";
import { Inter } from "next/font/google";
import { useCallback, useMemo, useState } from "react";

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

export default function Home({
  hospitals,
  mapboxToken,
  measures,
  globalStats,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedMeasure, setSelectedMeasure] = useState<MeasureType>(
    MeasureType.H_STAR_RATING
  );
  const [filters, setFilters] = useState<MeasureFilter[]>([]);
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

  const filteredHospitals = useMemo<FeatureCollection<any, Hospital>>(() => {
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

  const polygonValues = useMemo<(number | undefined)[]>(() => {
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
    return collected.features[0].properties?.values || [];
  }, [drawPolygonFeatures, filteredHospitals, selectedMeasure]);

  const polygonAggregate = useMemo(
    () => (polygonValues ? stats(polygonValues) : undefined),
    [polygonValues]
  );

  const filteredGlobalValues = useMemo(
    () =>
      (Object.keys(MeasureType) as MeasureType[]).reduce((result, type) => {
        result[type] = filteredHospitals.features.map(
          (h) => h.properties[type]
        );
        return result;
      }, {} as Record<MeasureType, (number | undefined)[]>),
    [filteredHospitals]
  );
  const filteredGlobalStats = useMemo(
    () =>
      (Object.keys(MeasureType) as MeasureType[]).reduce((result, type) => {
        result[type] = stats(filteredGlobalValues[type]);
        return result;
      }, {} as Record<MeasureType, MeasureStats>),
    [filteredGlobalValues]
  );

  const chartData = useMemo<BarChartPoint[]>(() => {
    const map = (polygonValues || filteredGlobalValues[selectedMeasure]).reduce(
      (result, val) => {
        if (!val) return result;
        const id = `${val}`;
        result[id] = {
          id,
          value: 1 + (result[id]?.value || 0),
        };
        return result;
      },
      {} as Record<string, BarChartPoint>
    );
    return Object.values(map).sort((a, b) => a.id.localeCompare(b.id));
  }, [polygonValues, filteredGlobalValues]);

  return (
    <main className={`flex min-h-screen p-0 ${inter.className}`}>
      <div className="w-[20rem] min-w-[20rem] flex flex-col p-5 via-slate-950 from-slate-950 to-slate-900 bg-gradient-to-br border-r border-r-slate-800 overflow-y-auto max-h-screen">
        <div className="border-b border-emerald-400 pb-3 mb-8 text-2xl bg-gradient-to-r to-violet-600 from-emerald-400 inline-block text-transparent bg-clip-text">
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
        <Summary
          {...{
            selectedMeasure,
            polygonAggregate,
            filteredGlobalStats,
            chart: <SimpleBarChart data={chartData} />,
          }}
        />
        <HcahpsMap
          {...{
            filteredHospitals,
            globalStats,
            mapboxToken,
            measures,
            onDeletePolygon,
            onUpdatePolygon,
            selectedMeasure,
          }}
        />
      </div>
    </main>
  );
}
