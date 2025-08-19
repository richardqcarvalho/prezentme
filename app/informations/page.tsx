import Form from "@/app/informations/form";
import { Card, CardContent } from "@/components/ui/card";

export default function Informations() {
  return (
    <Card className="h-3/4 w-3/4">
      <CardContent className="h-full">
        <Form />
      </CardContent>
    </Card>
  );
}
