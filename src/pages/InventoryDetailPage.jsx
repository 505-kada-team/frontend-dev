import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

// Dummy Data
const dummyDetails = {
  1: {
    name: "Tapioca Pearls",
    category: "Other",
    qty: 3,
    unit: "kg",
    price: 40000,
  },
  2: {
    name: "Matcha Powder",
    category: "Other",
    qty: 1,
    unit: "kg",
    price: 180000,
  },
};

export default function InventoryDetailPage() {
  const { id } = useParams();
  const item = dummyDetails[id];

  if (!item) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Item not found
        </h2>

        <p className="mt-2 text-muted-foreground">
          The inventory item you're looking for doesn't exist.
        </p>

        <Link
          to="/inventories"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-white transition hover:opacity-90"
        >
          <ArrowLeft size={18} />
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}

      <Link
        to="/inventories"
        className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft size={18} />
        Back to Inventory
      </Link>

      {/* Card */}

      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">

        {/* Header */}

        <div className="mb-8 flex items-center gap-5">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Package size={30} />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-foreground">
              {item.name}
            </h1>

            <p className="text-muted-foreground">
              {item.category}
            </p>

          </div>

        </div>

        {/* Information */}

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-border bg-background p-5">

            <p className="text-sm text-muted-foreground">
              Quantity
            </p>

            <h3 className="mt-2 text-2xl font-bold text-foreground">
              {item.qty} {item.unit}
            </h3>

          </div>

          <div className="rounded-2xl border border-border bg-background p-5">

            <p className="text-sm text-muted-foreground">
              Category
            </p>

            <h3 className="mt-2 text-2xl font-bold text-foreground">
              {item.category}
            </h3>

          </div>

          <div className="rounded-2xl border border-border bg-background p-5">

            <p className="text-sm text-muted-foreground">
              Price
            </p>

            <h3 className="mt-2 text-2xl font-bold text-primary">
              Rp {item.price.toLocaleString("id-ID")}
            </h3>

          </div>

        </div>
      </div>
    </div>
  );
}