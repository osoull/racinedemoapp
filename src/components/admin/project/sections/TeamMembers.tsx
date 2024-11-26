import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface TeamMembersProps {
  control: Control<any>;
}

export function TeamMembers({ control }: TeamMembersProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="team_members"
        render={({ field }) => (
          <FormItem>
            <FormLabel>أعضاء الفريق</FormLabel>
            <div className="space-y-4">
              {field.value?.map((_, index: number) => (
                <div key={index} className="flex gap-4">
                  <Input
                    placeholder="اسم عضو الفريق"
                    value={field.value[index]?.name || ""}
                    onChange={(e) => {
                      const newValue = [...field.value];
                      newValue[index] = { ...newValue[index], name: e.target.value };
                      field.onChange(newValue);
                    }}
                  />
                  <Input
                    placeholder="المنصب"
                    value={field.value[index]?.position || ""}
                    onChange={(e) => {
                      const newValue = [...field.value];
                      newValue[index] = { ...newValue[index], position: e.target.value };
                      field.onChange(newValue);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newValue = [...field.value];
                      newValue.splice(index, 1);
                      field.onChange(newValue);
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  field.onChange([...(field.value || []), { name: "", position: "" }]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة عضو
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}