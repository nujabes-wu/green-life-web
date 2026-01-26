import { MarketItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface MarketItemCardProps {
  item: MarketItem;
}

export function MarketItemCard({ item }: MarketItemCardProps) {
  const handleContact = () => {
    toast.info(`请联系卖家：${item.contact_info}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group border-dopamine-blue/20">
      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
        <Image 
          src={item.image_url || 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=300&q=80'} 
          alt={item.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
           <Button size="sm" variant="secondary" className="w-full font-bold" onClick={handleContact}>
              立即联系卖家
           </Button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-bold text-lg line-clamp-1 group-hover:text-dopamine-blue transition-colors" title={item.title}>{item.title}</h3>
           <span className="font-black text-dopamine-orange text-lg whitespace-nowrap ml-2">
             {item.price_cny > 0 ? `¥${item.price_cny}` : '免费'}
           </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{item.description}</p>
        <div className="pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
           <span>发布于近期</span>
           <span className="bg-muted px-2 py-1 rounded-md">个人闲置</span>
        </div>
      </div>
    </Card>
  );
}
