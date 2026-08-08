export interface Banner {
  image: string;
  title: string;
}

export const banners: Banner[] = [
  {
    image: "/banner_large_device/hero-banner-img-large-device (1).webp",
    title: "আবিষ্কার করুন বইয়ের পাতায়",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (2).webp",
    title: "নতুন বই, নতুন পৃথিবী",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (3).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (4).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (5).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (6).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (7).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (8).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (9).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (10).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
  {
    image: "/banner_large_device/hero-banner-img-large-device (11).webp",
    title: "গল্পে গল্পে বেড়ে ওঠা",
  },
];

export interface CategoryItem {
  title: string;
  items: [string, string, string][];
}

export const categories: CategoryItem[] = [
  {
    title: "একাডেমিক",
    items: [
      [
        "প্রথম-দ্বাদশ শ্রেণি",
        "9780199535569",
        "/book_cover_img/book_cover_img (0).webp",
      ],
      ["মেডিকেল", "9780140449136", "/book_cover_img/book_cover_img (1).webp"],
      ["স্কুল", "9780141439518", "/book_cover_img/book_cover_img (2).webp"],
      [
        "ইঞ্জিনিয়ারিং",
        "9780261103573",
        "/book_cover_img/book_cover_img (3).webp",
      ],
    ],
  },
  {
    title: "শিশু-কিশোর বই",
    items: [
      [
        "শিশু-কিশোর",
        "9780061120084",
        "/book_cover_img/book_cover_img (4).webp",
      ],
      [
        "বয়স যখন ০-৪",
        "9780385474542",
        "/book_cover_img/book_cover_img (5).webp",
      ],
      [
        "বয়স যখন ৫-৭",
        "9780141321073",
        "/book_cover_img/book_cover_img (6).webp",
      ],
      [
        "বয়স যখন ৮-১২",
        "9780439554930",
        "/book_cover_img/book_cover_img (7).webp",
      ],
    ],
  },
  {
    title: "আলিয়া মাদ্রাসা",
    items: [
      [
        "দাখিল: নবম-দশম শ্রেণি",
        "9780140449266",
        "/book_cover_img/book_cover_img (8).webp",
      ],
      [
        "দাখিল: নবম শ্রেণি",
        "9780141187761",
        "/book_cover_img/book_cover_img (9).webp",
      ],
      ["আলিম", "9780140449181", "/book_cover_img/book_cover_img (10).webp"],
      [
        "ইবতেদায়ি: চতুর্থ শ্রেণি",
        "9780140449273",
        "/book_cover_img/book_cover_img (11).webp",
      ],
    ],
  },
  {
    title: "কওমি মাদ্রাসা",
    items: [
      [
        "আমার বিভাগ",
        "9780140449334",
        "/book_cover_img/book_cover_img (12).webp",
      ],
      [
        "আরবি ও উর্দু অভিধান",
        "9780140449242",
        "/book_cover_img/book_cover_img (13).webp",
      ],
      [
        "আরবি ব্যাকরণ",
        "9780140449327",
        "/book_cover_img/book_cover_img (14).webp",
      ],
      [
        "উচ্চতর দাওরায়ে হাদিস",
        "9780140449211",
        "/book_cover_img/book_cover_img (15).webp",
      ],
    ],
  },
  {
    title: "ইসলামি বই",
    items: [
      [
        "কুরআন ও তাফসির",
        "9780192831937",
        "/book_cover_img/book_cover_img (16).webp",
      ],
      ["হাদিস", "9780140449143", "/book_cover_img/book_cover_img (17).webp"],
      ["সিরাত", "9780140449198", "/book_cover_img/book_cover_img (18).webp"],
      [
        "ইসলামি ইতিহাস",
        "9780140449280",
        "/book_cover_img/book_cover_img (19).webp",
      ],
    ],
  },
  {
    title: "সাহিত্য ও উপন্যাস",
    items: [
      [
        "বাংলা উপন্যাস",
        "9780141439600",
        "/book_cover_img/book_cover_img (20).webp",
      ],
      [
        "অনুবাদ সাহিত্য",
        "9780141439846",
        "/book_cover_img/book_cover_img (21).webp",
      ],
      ["কবিতা", "9780140424386", "/book_cover_img/book_cover_img (22).webp"],
      ["গল্প", "9780140424386", "/book_cover_img/book_cover_img (23).webp"],
    ],
  },
  {
    title: "চাকরি ও ভর্তি প্রস্তুতি",
    items: [
      [
        "বিসিএস প্রস্তুতি",
        "9780199535675",
        "/book_cover_img/book_cover_img (24).webp",
      ],
      [
        "ব্যাংক জব",
        "9780199535569",
        "/book_cover_img/book_cover_img (25).webp",
      ],
      [
        "বিশ্ববিদ্যালয় ভর্তি",
        "9780141439518",
        "/book_cover_img/book_cover_img (26).webp",
      ],
      [
        "শিক্ষক নিবন্ধন",
        "9780261103573",
        "/book_cover_img/book_cover_img (27).webp",
      ],
    ],
  },
];
