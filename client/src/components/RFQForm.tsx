import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocale } from "@/hooks/useLocale";

const rfqSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

type RFQFormData = z.infer<typeof rfqSchema>;

interface RFQFormProps {
  onSuccess?: () => void;
}

export default function RFQForm({ onSuccess }: RFQFormProps) {
  const { t } = useLocale();
  const { toast } = useToast();

  const form = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      deliveryAddress: "",
      dueDate: "",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createRFQ = useMutation({
    mutationFn: async (data: RFQFormData) => {
      const response = await apiRequest("POST", "/api/rfqs", {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
        items: [], // Can be expanded for specific item requests
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("rfq.createSuccess"),
        description: t("rfq.createSuccessDesc"),
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RFQFormData) => {
    if (data.budgetMin && data.budgetMax && data.budgetMin > data.budgetMax) {
      toast({
        title: t("common.error"),
        description: t("rfq.budgetRangeError"),
        variant: "destructive",
      });
      return;
    }
    createRFQ.mutate(data);
  };

  // Get tomorrow's date as minimum due date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{t("rfq.createNewRFQ")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rfq.form.title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("rfq.form.titlePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rfq.form.category")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("rfq.form.selectCategory")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rfq.form.description")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("rfq.form.descriptionPlaceholder")}
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("rfq.form.budgetMin")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("rfq.form.budgetMax")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rfq.form.deliveryAddress")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("rfq.form.deliveryAddressPlaceholder")}
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rfq.form.dueDate")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      min={minDate}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createRFQ.isPending}
              >
                {createRFQ.isPending && (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                )}
                {t("rfq.form.submit")}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => form.reset()}
              >
                {t("common.reset")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
