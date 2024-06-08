"use client";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import JsonEditor from "./json-editor";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "./ui/use-toast";

const Playground = () => {
  const router = useRouter();
  const generateSchema = z.object({
    text: z.string().min(10),
    json: z.string(),
  });
  const form = useForm<z.infer<typeof generateSchema>>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      json: `{
        "user": {
          "name": { "type": "string" },
          "age": { "type": "number" },
          "courses": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }`,
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof generateSchema>) {
    const formData = {
      data: values.text,
      format: JSON.parse(values.json),
    };
    const res = await fetch("/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    toast({
      title: "Json Creation",
      description: "Json Successfully Created Redirecting the User",
    });
    const route = await res.json();
    toast({
      title: "Json Creation",
      description: "Json Successfully Created Redirecting the User",
    });

    if (route) {
      const encodedJson = encodeURIComponent(JSON.stringify(route));
      router.push("/app/" + encodedJson);
    }
  }
  return (
    <section
      id="playground-sec"
      className="flex gap-4 h-full items-center justify-start flex-col"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="w-full h-auto flex items-start justify-center flex-col">
            <Button className="min-w-60" size="lg">
              Generate
            </Button>
          </div>
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{field.name.toUpperCase()}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-40 w-full sm:min-w-80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="json"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{field.name.toUpperCase()}</FormLabel>
                <FormControl>
                  <JsonEditor setJson={field.onChange} jsonText={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </section>
  );
};

export default Playground;
