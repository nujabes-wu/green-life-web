import { MallItem } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

interface MallItemCardProps {
  item: MallItem;
  user: User | null;
  onRedeem: (item: MallItem) => void;
}

export function MallItemCard({ item, user, onRedeem }: MallItemCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 h-full border-primary/10">
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <Image 
          src={item.image_url} 
          alt={item.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-2 right-2 flex gap-2">
            <Badge className="bg-black/50 backdrop-blur-sm hover:bg-black/70 border-none text-white font-normal">
              库存 {item.stock}
            </Badge>
        </div>
      </div>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1" title={item.title}>{item.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm mt-1 h-[40px]">{item.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-2 pb-4 px-6 flex items-center justify-between border-t bg-muted/20">
        <span className="text-primary font-black flex items-center gap-1.5 text-lg">
          <Coins className="h-5 w-5 fill-current" /> {item.points_cost}
        </span>
        <Button size="sm" onClick={() => onRedeem(item)} disabled={!user || item.stock <= 0} className={!user || item.stock <= 0 ? "" : "bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg transition-all"}>
          {item.stock <= 0 ? "已售罄" : "立即兑换"}
        </Button>
      </CardFooter>
    </Card>
  );
}
