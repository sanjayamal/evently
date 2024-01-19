import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/lib/database/models/category.model";
import { startTransition, useEffect, useState } from "react";
import {
  createCategory,
  getAllCategories,
} from "@/lib/actions/category.actions";

type CategoryDropdownProps = {
  onChangeHandler?: () => void;
  value?: string;
};

const CategoryDropdown = ({
  onChangeHandler,
  value,
}: CategoryDropdownProps) => {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as Array<ICategory>);
    };
    getCategories();
  }, []);

  const handleAddCategory = () => {
    createCategory({ categoryName: newCategory.trim() }).then((category) => {
      setCategories((prevCategories) => [...prevCategories, category]);
    });
  };
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map(({ _id, name }) => (
            <SelectItem value={_id} key={_id}>
              {name}
            </SelectItem>
          ))}
        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Add New Category
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>New Category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name"
                  className="input-field mt-3"
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startTransition(handleAddCategory)}
              >
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default CategoryDropdown;
