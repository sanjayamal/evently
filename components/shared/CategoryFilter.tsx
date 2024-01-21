"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const CategoryFilter = () => {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as Array<ICategory>);
    };
    getCategories();
  }, []);

  const onSelectCategory = (category: string) => {
    let newUrl = "";
    if (category && category != "all") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <Select onValueChange={(value) => onSelectCategory(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"all"} className="select-item p-regular-14">
          All
        </SelectItem>
        {categories.length > 0 &&
          categories.map(({ _id, name }) => (
            <SelectItem value={name} key={_id}>
              {name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
