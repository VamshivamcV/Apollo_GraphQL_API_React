import { useEffect, useState } from "react";
import "./App.css";
import AddOrder from "./components/AddOrder"
import { useQuery, useMutation, gql } from "@apollo/client";

export type Order = {
  id: number;
  description: string;
  totalInCents: number;
};

export type Customer = {
  id: number;
  name: string;
  industry: string;
  orders: Order[];
};
const MUTATE_DATA = gql`
  mutation MUTATE_DATA($name: String!, $industry: String!) {
    createCustomer(name: $name, industry: $industry) {
      customer {
        id
        name
      }
    }
  }
`;

const GET_DATA = gql`
  {
    customers {
      id
      name
      industry
      orders {
        description
        id
        totalInCents
      }
    }
  }
`;

function App() {
  const [name, setName] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const { loading, error, data } = useQuery(GET_DATA);

  const [
    createCustomer,
    {
      loading: createCustomerloading,
      error: createcustomererror,
      data: createcustomerdata,
    },
  ] = useMutation(MUTATE_DATA, { refetchQueries: [{ query: GET_DATA }] });
  // useEffect(() => console.log(loading, error, data));
  // useEffect(() =>
  //   console.log(
  //     createCustomer,
  //     createCustomerloading,
  //     createcustomererror,
  //     createcustomerdata
  //   )
  // );

  return (
    <div className="App">
      {error ? <p>something went wrong</p> : null}
      {loading ? <p>loading...</p> : null}
      {data
        ? data.customers.map((customer: Customer) => {
            return (
              <div key={customer.id}>
                <h2>
                  {customer.name + " (" + customer.industry + ")"}
                </h2>
                {customer.orders.map((order: Order) => {
                  return (
                    <div key={order.id}>
                      <p>{order.description}</p>
                      <p>
                        Cost: $
                        {(order.totalInCents / 100).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  );
                })}
                <AddOrder customerId={customer.id}/>
              </div>
            );
          })
        : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // console.log('submiing...', name, industry);
          createCustomer({ variables: { name: name, industry: industry } });
          if (!error) {
            setName("");
            setIndustry("");
          }
        }}
      >
        <div>
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <br/>
        <div>
          <label htmlFor="industry">Industry: </label>
          <input
            id="industry"
            type="text"
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
            }}
          />
        </div>
        <br/>
        <button disabled={createCustomerloading ? true : false}>
          Add Customer
        </button>
        {createcustomererror ? <p>Error creating customer</p> : null}
      </form>
    </div>
  );
}

export default App;
