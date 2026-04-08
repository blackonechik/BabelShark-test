import type { CustomersTableProps } from "../model/types";

export const CustomersTable = ({ customers }: CustomersTableProps) => (
  <div className="table-responsive">
    <table className="table table-striped table-hover align-middle shadow-sm">
      <thead className="table-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Full name</th>
          <th scope="col">Position</th>
        </tr>
      </thead>
      <tbody data-translation-root="positions">
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.id}</td>
            <td>{customer.fullName}</td>
            <td className="__t">{customer.position}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
