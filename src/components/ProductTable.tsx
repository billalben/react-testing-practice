import axios from "axios";
import { useQuery } from "react-query";
import { Product } from "../entities";
import { Table } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import QuantitySelector from "./QuantitySelector";

interface ProductTableProps {
  selectedCategoryId?: number;
}

const ProductTable = ({ selectedCategoryId }: ProductTableProps) => {
  const {
    data: products,
    isLoading: isProductsLoading,
    error: errorProducts,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get<Product[]>("/products");
      return data;
    },
  });

  if (errorProducts) return <div>Error: {errorProducts.message}</div>;

  const visibleProducts = selectedCategoryId
    ? products?.filter((p) => p.categoryId === selectedCategoryId)
    : products;

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {["Name", "Price", ""].map((header) => (
            <Table.ColumnHeaderCell key={header}>
              {header}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body
        role={isProductsLoading ? "progressbar" : undefined}
        aria-label={isProductsLoading ? "Loading products" : undefined}
      >
        {isProductsLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <Table.Row key={index}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <Table.Cell key={idx}>
                  <Skeleton />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}

        {!isProductsLoading &&
          visibleProducts!.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
              <Table.Cell>
                <QuantitySelector product={product} />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ProductTable;
