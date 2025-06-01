import { Select, Table } from "@radix-ui/themes";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QuantitySelector from "../components/QuantitySelector";
import { Category, Product } from "../entities";

function BrowseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductsLoading, setProductsLoading] = useState(false);
  const [isCategoriesLoading, setCategoriesLoading] = useState(false);
  const [errorProducts, setErrorProducts] = useState("");
  const [errorCategories, setErrorCategories] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const { data } = await axios.get<Product[]>("/products");
        setProducts(data);
      } catch (error) {
        if (error instanceof AxiosError) setErrorProducts(error.message);
        else setErrorProducts("An unexpected error occurred");
      } finally {
        setProductsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const { data } = await axios.get<Category[]>("/categories");
        setCategories(data);
      } catch (error) {
        if (error instanceof AxiosError) setErrorCategories(error.message);
        else setErrorCategories("An unexpected error occurred");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  if (errorProducts) return <div>Error: {errorProducts}</div>;

  const renderCategories = () => {
    if (isCategoriesLoading) {
      return (
        <div role="progressbar" aria-label="Loading categories">
          <Skeleton />
        </div>
      );
    }

    if (errorCategories) return null;

    return (
      <Select.Root
        onValueChange={(categoryId) =>
          setSelectedCategoryId(parseInt(categoryId))
        }
      >
        <Select.Trigger placeholder="Filter by Category" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Category</Select.Label>
            <Select.Item value="all">All</Select.Item>
            {categories?.map((category) => (
              <Select.Item key={category.id} value={category.id.toString()}>
                {category.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    );
  };

  const renderProducts = () => {
    if (errorProducts) return <div>Error: {errorProducts}</div>;

    const visibleProducts = selectedCategoryId
      ? products.filter((p) => p.categoryId === selectedCategoryId)
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
            visibleProducts.map((product) => (
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

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">{renderCategories()}</div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
