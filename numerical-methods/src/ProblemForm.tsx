import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";

interface ProblemFormProps {
  problem: any;
  problemState: any;
  setProblemState: any;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

const ProblemForm: React.FC<ProblemFormProps> = ({ problem, problemState, setProblemState, onSubmit, loading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProblemState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {Object.keys(problemState).map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{key.replace(/_/g, " ")}</label>
          <Input
            name={key}
            value={problemState[key]}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ))}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Calculating..." : "Calculate"}
      </Button>
    </form>
  );
};

export default ProblemForm;
