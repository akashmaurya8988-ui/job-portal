import Link from "next/link";
import {
  Code2,
  BrainCircuit,
  Palette,
  Megaphone,
  Landmark,
  Users,
} from "lucide-react";

const iconMap = {
  Code2,
  BrainCircuit,
  Palette,
  Megaphone,
  Landmark,
  Users,
};

export default function CategoryCard({ category }) {
  const IconComponent = iconMap[category.icon] || Code2;

  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category.name)}`}
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center shrink-0">
        <IconComponent className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
          {category.name}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">{category.count}</p>
      </div>
    </Link>
  );
}