import axios from "axios";
import { useQuery } from "react-query";
import { Category } from "../entities";
import Skeleton from "react-loading-skeleton";
import { Select } from "@radix-ui/themes";

interface CategorySelectProps {
  onChange: (categoryId: number | undefined) => void;
}

const CategorySelect = ({ onChange }: CategorySelectProps) => {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: errorCategories,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get<Category[]>("/categories");
      return data;
    },
  });

  if (isCategoriesLoading) {
    return (
      <div role="progressbar" aria-label="Loading categories">
        <Skeleton />
      </div>
    );
  }

  if (errorCategories) return null;

  return (
    <Select.Root onValueChange={(categoryId) => onChange(parseInt(categoryId))}>
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

export default CategorySelect;
