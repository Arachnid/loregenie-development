import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().optional(),
});

export type ImageGenerationFormValues = z.infer<typeof schema>;

export type ImageGenerationFormProps = {
  onSubmit: SubmitHandler<ImageGenerationFormValues>;
  isSubmitting?: boolean;
};

export const ImageGenerationForm = ({
  onSubmit,
  isSubmitting,
}: ImageGenerationFormProps) => {
  const form = useForm<ImageGenerationFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                The image will take details from the page. If there is any extra
                information you want to include, you can add it here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Generate Image"}
        </Button>
      </form>
    </Form>
  );
};
