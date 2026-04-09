export const STORES = ["Bedford", "Berry", "Grand", "Irving", "Onderdonk"];

export const CATEGORIES = [
  { name: "🥩 Protein", hasOnHand: true, items: [
    "Brisket Smoked 牛 (cambro)", "Chicken Cooked 鸡 (boat)", "Cooked Shrimp 虾 (QT)",
    "Mushroom Sauteed (LB)", "Chicken Vegan 素鸡 (CS)", "Tofu 豆腐 (boat)"
  ]},
  { name: "🥬 Vegetable", hasOnHand: true, items: [
    "Cilantro 芫茜 (boat)", "Yu Choy 菜芯 (boat)", "Red Cabbage 椰菜 (boat)",
    "Shallot Sliced 红葱 (boat)", "Scallion 葱花 (boat)", "Mushroom Sliced 香菇 (boat)",
    "Cucumber Sliced 黄瓜 (boat)", "Jalapeno Sliced 青椒 (boat)", "Basil Thai 九层塔 (bag)",
    "Carrot Pickled 萝卜 (boat)", "Lime Sliced 青柠 (boat)", "Bean Sprout 芽菜 (CS)"
  ]},
  { name: "🫙 Sauce", hasOnHand: false, items: [
    "Sauce Hoisin Packet 海鲜包 (CS)", "Sauce Sriracha Packet 辣椒 (CS)",
    "Sauce Fish 鱼露汁 (QT)", "Sauce PMB 面包酱 (QT)", "Sauce Lemongrass 香茅汁 (QT)",
    "Sauce Peanut 花生酱 (QT)", "Sauce Aoili 蛋黄酱 (QT)", "Sauce Vegan Aoili 素蛋黄酱 (QT)",
    "Mushroom Pate (QT)", "Chili Oil 辣椒油 (QT)"
  ]},
  { name: "🥤 Drink/Soda", hasOnHand: false, items: [
    "Viet Coffee 咖啡 (bottle)", "Ale Ginger 姜气水 (CS)", "Ginger Beer 姜啤酒 (CS)",
    "Coke 可乐 (CS)", "Diet Coke 减肥可乐 (CS)", "Perrier Water 有氣水 (CS)",
    "Black Ice Tea 冰茶 (bottle)", "Spring Water 矿泉水 (CS)", "Yuzu Original 原味 (CS)",
    "Yuzu White Peach 白桃味 (CS)", "Yuzu Zero 无糖 (CS)"
  ]},
  { name: "🍞 Others", hasOnHand: false, items: [
    "Herbs-Only Cup 芽菜杯 (cups)", "Veggie-Only Cup 菜杯 (cups)",
    "Bread 面包 CK only (piece)", "Red ToGo Bag 外买袋 (piece)",
    "Utensil Pack 用乡套 (piece)", "Dine-in Bowl 沙拉碗 (piece)",
    "Crème Caramel 焦糖奶油 (ea)", "Rice 米 (BAG)", "EGG 鸡蛋 (CS)",
    "Toothpicks 牙签 (pk)", "Hot Oil 热油 (QT)", "Lighter 打火机 (ea)"
  ]},
  { name: "🌾 Dry Good", hasOnHand: false, items: [
    "Vermicelli Noodle 米粉 (CS)", "Pho Noodle 河粉 (CS)", "Dry Mushroom 干香菇 (CS)",
    "Rock Sugar 冰糖 (CS)", "Salt 盐 (CS)", "Spring Roll 22cm 大米纸 (CS)",
    "Spring Roll 16cm 小米纸 (CS)", "Mushroom Powder 蘑菇精 (CS)",
    "Soup Spice Blend 汤香料 (QT)", "Oil 油 (CS)", "Lime Juice 青柠汁 (Gallon)"
  ]},
  { name: "📦 TOGO/Containers", hasOnHand: false, items: [
    "Container 32oz 大汤杯 (CS)", "Container 24oz 小汤杯 (CS)",
    "Box Rectan 24oz 小春卷盒 (CS)", "Box Circle 24oz 沙拉碗 (CS)",
    "Box Rectan 28oz 大春卷盒 (CS)", "Souffle Cup 2oz 酱料盒 (set)",
    "Chopsticks 筷子 (CS)", "Spoon Soup 汤勺 (CS)", "Fork 叉子 (CS)",
    "Dinner Napkin 外卖纸巾 (CS)", "Dispenser Napkin 堂吃纸巾 (CS)",
    "Bag Banh Mi 面包袋 (pack)", "Banh Mi Wrap 面包纸 (CS)",
    "16oz PET Cup w/Lid 咖啡杯/盖 (CS)", "Kraft Paper Food Tray 纸船 (CS)"
  ]},
  { name: "🧹 Cleaning", hasOnHand: false, items: [
    "Windex Gallon 玻璃水 (CS)", "Dish Liquid Green 洗碗液 (CS)",
    "Oven Cleaner 烤箱清洁剂 (CS)", "Drinking Paper Cup 纸水杯 (PK)",
    "Garbage Bag blk/blue 垃圾袋 (CS)", "Paper Towel 擦手纸 (CS)",
    "Paper Toilet 厕所纸 (CS)", "Paper C-Fold 纸 (CS)", "Aluminum Foil 铝纸 (PC)",
    "Plastic Wrap 18' 保鲜纸 (PC)", "Dishwash Glove 洗碗手套 (PC)",
    "Mop Head 拖把头 (CS)", "Rags 手布 (BAG)", "Bleach 漂白水 (CS)",
    "Glove XL/L/M/S 手套 (CS)"
  ]},
  { name: "🔖 Infrequent", hasOnHand: false, items: [
    "8oz Deli Cup 芽菜空盒 (SET)", "Hoisin Bottles 瓶装海鲜酱 (CS)",
    "Sriracha Bottles 瓶装辣酱 (CS)", "Food Tray Paper 托盘纸 (CS)",
    "Lucys ToGo Paper Bag 纸外卖袋 (CS)", "Condensed Milk 炼乳 (CS)",
    "Coffee Cup & Lid 咖啡杯盖 (CS)", "Coffee Straw 咖啡吸管 (EA)",
    "Coffee ToGo Bag 咖啡打包袋 (EA)", "Coffee Bottles (CS)",
    "Steel Sponge 钢丝球 (CS)", "Regular Sponge 普通海绵 (box)",
    "Printer Roll 打印纸卷 (pack)", "Marker 记号笔 (pack)", "Staples 订书针 (pack)",
    "Pine Sol 松木清洁剂 (CS)", "Paper Food Tray 纸盘 (CS)", "Tong 夹子 (ea)",
    "Water Filter 滤水器 (pack)", "Blue Tape 蓝胶带 (roll)"
  ]}
];

// export const SHEET_COLUMNS = CATEGORIES.flatMap(cat => cat.items);
export const SHEET_COLUMNS = CATEGORIES.flatMap(cat =>
  cat.items.flatMap(item =>
    item === 'Glove XL/L/M/S 手套 (CS)'
      ? ['Glove_XL', 'Glove_L', 'Glove_M']
      : [item]
  )
);