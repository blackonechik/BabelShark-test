import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import {
  CUSTOMERS_PUBLICATION,
  CustomersCollection,
} from "@/entities/customer";
import { usePositionTranslations } from "@/features/translate-positions";
import { CustomersTable } from "@/widgets/customers-table";

export const CustomersDirectoryPage = () => {
  const { customers, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe(CUSTOMERS_PUBLICATION);

    return {
      customers: CustomersCollection.find({}, { sort: { id: 1 } }).fetch(),
      isLoading: !handle.ready(),
    };
  });

  usePositionTranslations();

  return (
    <main className="app-shell">
      <section className="container py-5">
        <div className="hero-card mx-auto">
          <div className="d-flex flex-column gap-2 mb-4">
            <span className="eyebrow">Meteor + MySQL + TypeScript</span>
            <h1 className="display-6 mb-0">Customers directory</h1>
            <p className="text-secondary mb-0">
              Реактивная таблица клиентов и их должностей с серверным переводом
              через <code>Meteor.call()</code> и отслеживанием DOM через{" "}
              <code>MutationObserver</code>.
            </p>
          </div>

          {isLoading ? (
            <div className="alert alert-primary mb-0" role="status">
              Loading customers from MySQL...
            </div>
          ) : customers.length > 0 ? (
            <CustomersTable customers={customers} />
          ) : (
            <div className="alert alert-warning mb-0" role="alert">
              No rows were received. Check the MySQL connection settings and the
              expected schema in <code>settings.example.json</code>.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
