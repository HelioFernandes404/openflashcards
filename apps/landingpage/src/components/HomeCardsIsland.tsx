import { motion } from "framer-motion";
import { CardIsland } from "./CardIsland";

interface CardData {
  title: string;
  description: string;
  imagePng: string;
  imageWebp: string;
}

interface HomeCardsProps {
  cards: CardData[];
}

export function HomeCardsIsland({ cards }: HomeCardsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
        >
          <CardIsland
            className="h-full"
            title={card.title}
            description={card.description}
            content={
              <picture>
                <source srcSet={card.imageWebp} type="image/webp" />
                <img src={card.imagePng} alt={card.title} loading="lazy" />
              </picture>
            }
          />
        </motion.div>
      ))}
    </div>
  );
}
