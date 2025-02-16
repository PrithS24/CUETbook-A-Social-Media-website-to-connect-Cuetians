"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const RightSideBar = () => {
  const [showAllSponsers, setShowAllSponsers] = useState(false);
  const [isClient, setIsClient] = useState(false); // Fix hydration issue

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sponsers = [
    {
      name: "Gadgetry BD",
      description:
        "Your go-to destination for tech products and electronic gadgets.",
      image: "/Images/gadget.jpg",
      website: "https://www.facebook.com/gadgetrybd4u",
    },
    {
      name: "Kaya",
      description:
        "Unique handmade wooden jewelry and crafts crafted with love.",
      image: "/Images/kaya.jpg",
      website: "https://www.facebook.com/profile.php?id=100089798335058",
    },
    {
      name: "Textum",
      description: "Your ultimate shop for custom jerseys and trendy t-shirts.",
      image: "/Images/textum.jpg",
      website: "https://www.facebook.com/profile.php?id=61565061639069",
    },
    {
      name: "Sathi's Baking House",
      description:
        "Delighting you with freshly baked treats and sweet creations.",
      image: "/Images/bake.jpg",
      website:
        "https://www.facebook.com/groups/788645538147918/user/100089838461982",
    },
    {
      name: "Whimsy Craft",
      description: "Exquisite handmade resin jewelry and enchanting trinkets.",
      image: "/Images/whimsy.jpg",
      website: "https://www.facebook.com/profile.php?id=61555370361365",
    },
  ];

  const displaySponsers = showAllSponsers ? sponsers : sponsers.slice(0, 3);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex text-lg font-semibold items-center dark:text-white">
            <TrendingUp className="mr-2 h-5 w-5 text-primary " />
            Popular Sponsers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {displaySponsers.map((sponser, index) => (
              <motion.li
                key={sponser.name}
                initial={isClient ? { opacity: 0, y: 20 } : {}}
                animate={isClient ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Image
                  src={sponser.image}
                  alt={sponser.name}
                  width={200}
                  height={160}
                  className="object-contain rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-md font-semibold">{sponser.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sponser.description}
                  </p>
                  <a
                    href={sponser.website}
                    target="_blank"
                    className="text-primary text-sm flex items-center mt-1 hover:underline"
                  >
                    Visit Website <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </motion.li>
            ))}
          </ul>
          {sponsers.length > 3 && (
            <Button
              variant="outline"
              className="w-full mt-4 dark:text-white"
              onClick={() => setShowAllSponsers(!showAllSponsers)}
            >
              {showAllSponsers ? "Show Less" : "Show More"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.aside>
  );
};

export default RightSideBar;
