import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProfileCard() {
  return (
    <Card className="w-full max-w-sm bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl">John Doe</CardTitle>
        <CardDescription>Software Engineer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none">Date of Birth:</p>
            <p className="text-sm text-muted-foreground">January 1, 1990</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none">Address:</p>
            <p className="text-sm text-muted-foreground">
              123 Main St, Anytown, USA 12345
            </p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none">Phone:</p>
            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium leading-none">Email:</p>
            <p className="text-sm text-muted-foreground">
              john.doe@example.com
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
