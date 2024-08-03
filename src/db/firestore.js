// addProductsToFirestore.js
import { collection,  getDocs , addDoc ,    query, where , updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { v4 as uuidv4 } from 'uuid';



export const products = [
    {
        id: 'zRBijf9EHrDQ',
        title: 'IKAAMA - Ring Light',
        price: 50,
        category: 'Accessories',
        description: 'Adjustable ring light: The 10.2-inch ring light has 3 color light modes: white, warm yellow, and warm white. The color temperature ranges from 2,200 K-12,000 K. Each mode has 11 adjustable brightness levels, totaling 33 options. This ring light will meet all your needs in different scenes.',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642785148/Productos%20Amazonas/utuszzonwett1uteqlgz.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642785158/Productos%20Amazonas/jurzyeffldfb2njwkbrv.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642785166/Productos%20Amazonas/ksdj7adhw18hpkxbzhc2.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642785175/Productos%20Amazonas/drkxt0jcihgqjik7kmwp.jpg',
        brand: 'IKAAMA',
        rate: 2,
        quantity: 29
    },
    {
        id: 'k6uzh2fjdmn7',
        title: 'Lenovo Laptop Chromebook',
        price: 800,
        category: 'Laptops',
        description: 'High-performance laptop: The Chromebook S330 is equipped with a MediaTek MTK8173C processor, Chrome OS, 4 GB LPDDR3, 64 GB eMMC 5.1, and much more -Elegant design: Sleek, stylish, and secure, the Lenovo Chromebook S330 is less than an inch thick and 3.3 lbs light with a 14-inch FHD display. Perfect for daily computing and multimedia, online or offline. -Powerful processing: Perfect for all your daily computing needs, the Lenovo Chromebook S330 offers a range of performance features. Enjoy powerful processing for daily tasks, LPDDR3 memory for multitasking, eMMC storage for quick boot-ups, fast software loading, and an additional 100 GB of cloud storage via Google Drive -Built for connection: Full I/O support comes standard on the laptop with USB-C, micro SD, and USB 3.0 for effortless connectivity. Additionally, this Chromebook also features powerful WiFi AC 2 x 2 with Bluetooth 4.1, a 720p webcam, and two 2W speaker systems for effortless collaboration, all supported through a set of collaborative apps via Chrome OS -Easy to use: The Lenovo Chromebook S330 is easy to use, offers built-in virus protection, and keeps going with long battery life. Plus, no setup is needed, just a Google account so your stuff stays with you through cloud storage of your emails, maps, docs, photos, and more',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642282411/SPRING-3/productos/laptop5/laptop5.1_bet4br.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642282413/SPRING-3/productos/laptop5/laptop5.2_p2dfco.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642282416/SPRING-3/productos/laptop5/laptop5.3_hmnoaf.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642282419/SPRING-3/productos/laptop5/laptop5.4_xsacd8.jpg',
        brand: 'Lenovo',
        rate: 3,
        quantity: 11
    },
    {
        id: 'vxujaszda4c3',
        title: 'Android Tablet',
        price: 230,
        category: 'Tablets',
        description: 'Incredible performance: FEONAL Android tablet with high-speed 9.0 Pie processing system, A7 Quad-Core chip, 1.3 GHz makes the tablet highly responsive and can open multiple videos and apps smoothly. This tablet is the most popular model for 2020, also a perfect gift for family and friends. Larger than larger: The 10.1-inch large screen with HD resolution of 1280 x 800 brings every movie detail to your eyes. 32 GB of internal storage and 2 GB of RAM with support for expansion up to 128 GB. Enough for use so you can easily use more apps and store more movies, e-books, songs, photos, and other files. Stable connectivity: The portable tablet supports plug-in phone cards and can be easily used in environments without wireless networks. Compatible with WiFi 2.4G and 3G phone calls, stable connectivity can be well compatible with your home wireless network. SIM card not included. For SIM card network support, see the product description. Large-capacity battery: Built-in 6000 mAh battery for long-lasting life. A full charge can provide you with long hours of reading, browsing, watching movies, and playing games. With a lightweight body, it makes you enjoy a portable tablet anywhere, anytime. Google GMS Certification: FEONAL tablet is Google GMS certified. You can safely use various Google functions, such as search, voice assistant, Netflix, YouTube, G-mail, Skype, GPS, etc. This tablet can block unverified ads, plus download a large number of Google Market apps for free.',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642383470/Productos%20Amazonas/pnfeemxgw1gn6zwomjrw.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642383474/Productos%20Amazonas/dn70glmdlp0a3kebhytu.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642383480/Productos%20Amazonas/vz3354fkelfmungtyqse.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642383484/Productos%20Amazonas/xq5poljsmb7b7kszumim.jpg',
        brand: 'FEONAL',
        rate: 2,
        quantity: 38
    },
    {
        id: 'ajs2210dwqn',
        title: 'Tribit XSound Go Speaker',
        price: 38,
        category: 'Accessories',
        description: 'Innovative design: We designed this speaker to fit any lifestyle aesthetic, with simplistic curves that are designed to fit perfectly in the palm of your hand, for music support right out of the box. Ultra-portability makes it easy to fit into your bag effortlessly. 24 hours of playtime: A full charge allows your music to play for up to 24 hours, so your soundtrack can literally carry you through the day and night. Dynamic stereo sound drivers: Enhanced with 2 x 6 W, this speaker delivers surround sound with impressive rich bass, crystal-clear mids, and highs exactly the way the artists intended for you to hear. Waterproof: IPX7 dust and splash resistance make this Bluetooth speaker ready for any adventure, from poolside to sandy tracks. Always connected: Ultimate stability, with wireless Bluetooth 4.2 technology that connects your devices within an impressive 66 ft range. Armed with a built-in microphone that makes it easy for hands-free calls, Siri, and Google Now support, AUX input support.',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1683661901/Productos%20Amazonas/a1_ke7na0.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1683661901/Productos%20Amazonas/a3_ff4rob.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1683661901/Productos%20Amazonas/a2_n3p0jd.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1683661902/Productos%20Amazonas/ab_o0fzvp.jpg',
        brand: 'Tribit',
        rate: 4,
        quantity: 2
    },
    {
        id: '5ylili2ufeku',
        title: 'TCL 20 SE - Cell Phone',
        price: 250,
        category: 'Cellphones',
        description: 'Fast and smooth performance: Feel the instant response time thanks to the Qualcomm Octa-Core processor. Compatible with T-Mobile and AT&T LTE networks. (This device is compatible with AT&T\'s new network next year). This device is currently not certified for use on Verizon. Not compatible with any CDMA network. (such as Verizon, Sprint, Spectrum, Xfinity, etc.) -Captivating cinematic visual experience: Enjoy a stunning display with bright, vivid colors anywhere with the TCL 20 SE smartphone. A 6.82-inch V-notch display, powered by NXVISION, shows your media at its best. With a 90% screen-to-body ratio and a 20.5:9 aspect ratio for optimal viewing in a slim form, the expansive display gives you the maximum screen space to stream.-48 MP intelligent quad camera: Capture effortlessly high-definition images with a 48 MP AI rear camera. Capture multiple perspectives with macro, depth, and wide-angle cameras, plus an impressive 13 MP front camera. Every shot you take will be stunning.-Large 128 GB internal storage: The phone\'s 128 GB memory lets you store and access all the photos, videos, music, books, and files you need instantly without worrying about running out of space. You can also add up to 256 GB of memory with a microSD card (sold separately). -Enjoy more with a long-lasting 5000 mAh battery: The 5000 mAh battery lets you enjoy your movies, music, and browsing for hours on a single charge, while on-the-go reverse charging lets you power all your other devices. (Note: This phone does not support 5G WiFi, NFC, and 5GHz)',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642289949/Productos%20Amazonas/tdsfoquh4fht9tbm2ql4.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642289956/Productos%20Amazonas/nq1gduvp2ogydocixvw7.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642289965/Productos%20Amazonas/lttd8x2tfwnpsqrzw5kg.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642289973/Productos%20Amazonas/yjnsf4fn948jpb4q8fxh.jpg',
        brand: 'TCL',
        rate: 2,
        quantity: 17
    },
    {
        id: 'f5dgpiq57gs0',
        title: 'Samsung Galaxy Book Pro',
        price: 900,
        category: 'Laptops',
        description: 'Easy on the eyes: Everything looks brilliant with the first 13.3 / 15.6-inch AMOLED screen on a Galaxy Book; enjoy vibrant viewing while you work or school indoors or in direct sunlight, and reduce eye strain by reducing harmful blue light -The lightest Galaxy Book laptop: Sleek, ultra-thin, and available in a stylish dual-color design, Galaxy Book Pro is the lightest laptop and won\'t weigh you down -Do it in a flash: From downloading large documents quickly to watching streams without lag, and more, all with the new 11th generation Core processor that\'s Intel Evo certified, so it runs on a high-quality platform; with 512 GB of storage, you\'ll have all the space you need -Long-lasting battery: Works up to 20 hours on a full battery and then quickly recharges with our super small and lightweight charger -Work and play: Sync your devices and switch from work affairs to personal matters; set up the computer as a second screen for more productivity; share files with Quick Share; enjoy your games on a bigger screen; connect your Galaxy Buds Pro and switch seamlessly from video conferencing to catching up with your friends; with Samsung SmartThings capabilities, control other devices with a tap -Look like a pro: Make WFH work for you with tools that help you look, sound, and do your best. Attend a last-minute meeting and still make a good impression with our camera beauty filter; hide your family\'s hustle with background noise removal and more -Better WiFi, updated OS: Experience next-generation Wi-Fi 6E with speeds up to 3x faster than regular Wi-Fi; get more done on a Windows 10 OS, now updated to make your life even easier',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642279825/SPRING-3/productos/laptop2/laptop2.1_zydf6v.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642279827/SPRING-3/productos/laptop2/laptop2.2_mwcz6r.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642279830/SPRING-3/productos/laptop2/laptop2.3_ifauon.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642279832/SPRING-3/productos/laptop2/laptop2.4_k4z4z6.jpg',
        brand: 'Samsung',
        rate: 4,
        quantity: 5
    },
    {
        id: 'eoc5e4h7y51f',
        title: 'Canon EOS R6',
        price: 569,
        category: 'Cameras',
        description: 'High image quality with a new 20-megapixel full-frame CMOS sensor. -DIGIC X image processor with an ISO range of 100-102400; expandable to 204800. -High-speed continuous shooting of up to 12 fps with mechanical shutter and up to 20 fps with electronic (silent) shutter. -Dual Pixel CMOS AF, covers approximately 100% area with 1,053 AF points. -Subject tracking for people and animals using deep learning technology.',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1641654716/SPRING-3/productos/camara/Rectangle_36_fvehjl.png', 'https://res.cloudinary.com/silviajcn/image/upload/v1641654752/SPRING-3/productos/camara/Frame_61_pgrtcp.png', 'https://res.cloudinary.com/silviajcn/image/upload/v1641654746/SPRING-3/productos/camara/Frame_61_1_f2tmgp.png'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1641778154/SPRING-3/productos/camara/banner_fngqs7.jpg',
        brand: 'Canon',
        rate: 5,
        quantity: 21
    },
    {
        id: 'az86a317gvqn',
        title: 'Cimetech - Keyboard and Mouse Combo',
        price: 150,
        category: 'Accessories',
        description: 'Slim and ergonomic design: The slim keyboard has a tilt angle for a great typing position. Sweat-resistant, touch-friendly wireless mouse in a contoured shape that will provide hours of comfortable work. The full-size keyboard is quick with a numeric keypad and instant access to your music, internet, email, volume, etc., via multimedia keys. (Hotkeys are not fully compatible with the Mac system). Less noise and profile key. Fast 2.4G wireless Plug and Play: Simply connect both your portable keyboard and mouse with one USB receiver (the nano receiver simply places the mouse near the battery compartment). High precision: DPI 1600 wireless mouse in 3 levels: you can easily change the sensitivity of this wireless mouse\'s cursor depending on your activities.',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1683660860/Productos%20Amazonas/a1_g0krew.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1683660861/Productos%20Amazonas/a2_rp9rqc.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1683660860/Productos%20Amazonas/a3_zix2ye.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1683660860/Productos%20Amazonas/ab_r8sxih.jpg',
        brand: 'Cimetech',
        rate: 2,
        quantity: 11
    },
    {
        id: 'g0xpwxiz7y1p',
        title: 'ASUS ROG Strix G15',
        price: 950,
        category: 'Laptops',
        description: 'NVIDIA GeForce RTX 3070 8GB GDDR6 with ROG Boost -Latest AMD Ryzen 9 5900HX 5th generation processor (16M cache, up to 4.5 GHz) -15.6-inch Full HD 300 Hz 3 ms display and 1920 x 1080 IPS -16 GB DDR4 3200 MHz RAM | 1 TB PCIe NVMe M.2 SSD | Windows 10 Home -ROG Intelligent Cooling thermal system with liquid metal Thermal Grizzly compound',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642281861/SPRING-3/productos/laptop4/laptop4.1_hiwjjq.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642281862/SPRING-3/productos/laptop4/laptop4.2_pshoqq.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642281864/SPRING-3/productos/laptop4/laptop4.3_orsusw.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642281867/SPRING-3/productos/laptop4/laptop4.4_dymqjc.jpg',
        brand: 'Asus',
        rate: 5,
        quantity: 2
    },
    {
        id: 'hrg2yw7giyax',
        title: 'Fire 7 Kids Pro',
        price: 150,
        category: 'Tablets',
        description: 'Save up to $89 on a tablet (not a toy) designed specifically for kids ages 6 and up that includes 1 year of Amazon Kids+, parental controls, a slim case, and a 2-year worry-free guarantee. School-aged children will enjoy 1 year of Amazon Kids+ subscription that unlocks over 20,000 apps, games, books, videos, songs, and Audible audiobooks. They\'ll find educational content from National Geographic, Rabbids Coding, LEGO, and others, plus over 9,000 titles for kids ages 6 and up. After 1 year, the subscription will automatically renew every month starting at just $2.99 per month plus applicable taxes. You can cancel anytime by visiting the Amazon Parent Dashboard or contacting Customer Service. Content availability may vary by location and date. In addition to Kids+ content, Kids Pro tablets include access to a digital store. Kids can request apps while parents approve purchases and downloads. Parents can add access to apps like Toca Life and Zoom. The browser comes with built-in controls designed to help filter inappropriate sites and allow parents to add or block specific websites at any time. Stay in touch. Kids can send announcements and make voice and video calls over Wi-Fi to approved contacts with Alexa-enabled devices or the Alexa app. 2 years worry-free guarantee and slim case included. If it breaks, return it, and we\'ll replace it for free. Features a quad-core processor, 7-inch screen, dual camera, micro USB port, and expandable storage of up to 512 GB.',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642383337/Productos%20Amazonas/zmtsxfinz1lyyqghgydg.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642383344/Productos%20Amazonas/lqqqe9aaqedcvxfml1nq.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642383351/Productos%20Amazonas/ymswofztcoy4bv9cxsmu.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642383364/Productos%20Amazonas/hg2sxcl4jiqckv2fvxdv.jpg',
        brand: 'Amazon',
        rate: 3,
        quantity: 8
    },
    {
        id: 'az8654553alb',
        title: 'TREBLAB HD77 - Speaker',
        price: 70,
        category: 'Accessories',
        description: 'Extraordinary 360° HD Sound + Option to Connect Two Speakers: Each of our TWS Bluetooth portable speakers comes with 25W of crisp 360° HD sound and DualBass subwoofers for an unparalleled listening experience. If that\'s not enough, you can connect two wireless speakers together for true high-definition surround sound that will blow your mind. Made for outdoor sports and adventures: Don\'t be fooled by the beautiful look and cool ambient LEDs of this waterproof Bluetooth speaker. It\'s made tough for all your outdoor sports, hiking, camping, and getting active. Now grab your HD77 waterproof speakers, put on your favorite tunes, and enjoy the outdoors with your family and friends. Rain or snow, It is A Go - HD77 is a brave and strong wireless speaker. It\'s not afraid of moisture or tough love. It\'s an IPX6 waterproof, shockproof, and wireless speaker, so it loves to sing in the rain and doesn\'t mind being dropped, kicked, or bounced. Powered all day with a single charge, feel free to leave the charger at home and go play. HD77 doesn\'t play games with PlayXTend power-saving technology and a high-capacity 5200 mAh battery, so you can play for up to 20 hours of medium volume per charge. Futuristic features: 1. Built-in microphone for calls. 2. Cool, deep ambient LEDs set the mood. 3. Easy setup in seconds via Bluetooth with your iOS, Android, or Windows device. 4. Intuitive indicator lights help you connect easily. 5. 33 ft signal range so you can roam with your phone still in your pocket. 6. Hand strap and carabiner to hang the wireless Bluetooth speaker on your backpack.',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1683662550/Productos%20Amazonas/a1_lfrxyy.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1683662550/Productos%20Amazonas/a2_b60av2.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1683662550/Productos%20Amazonas/a3_canzau.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1683662551/Productos%20Amazonas/ab_gepvfb.jpg',
        brand: 'TREBLAB',
        rate: 2,
        quantity: 26
    },
    {
        id: '5n9lm6jheipz',
        title: 'Samsung Galaxy A52 5G',
        price: 520,
        category: 'Cellphones',
        description: 'Play, stream and enjoy your favorite shows, work on your game, and keep your playlist blasting with the long-lasting battery of the Galaxy A52 5G - When you need a power boost, super-fast charging will get you back up in no time. Dual-SIM. Nano-SIM size (4FF) -Work fast, play hard: Get into the flow and stay there with Galaxy A52 5G - With a fast and reliable processor plus 5G connectivity in your pocket, you decide what your limits are or not',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642289373/Productos%20Amazonas/fgcsxgeafvyi4roiflcd.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642289386/Productos%20Amazonas/wbn3brpd3pkafjc3i0be.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642289396/Productos%20Amazonas/ugxocajisya1ri8penkc.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642289411/Productos%20Amazonas/vjvpjb1pcmkyt0cib4zy.jpg',
        brand: 'Samsung',
        rate: 5,
        quantity: 28
    },
    {
        id: '0j8m5t4c7ne3j',
        title: 'Fire 7 Tablet',
        price: 290,
        category: 'Tablets',
        description: '7-inch IPS display; 16 or 32 GB of internal memory (add up to 512 GB with microSD card). Faster 1.3 GHz quad-core processor. Up to 7 hours of reading, web browsing, video and music playback. Now with hands-free Alexa. 1 GB of RAM. 2 MP front and rear cameras with 720p HD video recording. Stay on track - Check email, make video calls, update shopping lists, and set reminders. Use your favorite apps like Zoom, Outlook, and OneNote',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642382155/Productos%20Amazonas/jqght8igwi9vqug2xkr6.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642382165/Productos%20Amazonas/qxo8krcoefivto905zpw.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642382170/Productos%20Amazonas/n0ctgpdfeohrepndaoau.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642382177/Productos%20Amazonas/ilbwryl9ebhes8gufwzt.jpg',
        brand: 'Amazon',
        rate: 4,
        quantity: 20
    },
    {
        id: 'wy9oekq0njjy',
        title: 'Lisen - Electronic Device Stand',
        price: 80,
        category: 'Accessories',
        description: 'Weighted non-slip base: This desktop phone stand is the only one on the market equipped with a weighted base and a taller aluminum alloy electronic stand. So this phone stand is tall and stable enough to support all phones and tablets from 4 to 10 inches. Like iPhone 13 Pro/12 Pro/12 Pro Max/12 Mini/iPhone 11/11Pro/Max/X/MAX/XR/8/8P, Note 20/10/9/8/Plus, Samsung Galaxy S21 Ultra/10/S9/S8, Switch, iPad Mini, iPad Air, small tablet, etc. Adjustable height and angle: This cell phone stand meets an ergonomic design. The height can be easily adjusted between 7.1 and 8.5 inches (adjustable range of 1.4 inches), the angle is adjustable between 5° and 85°, providing you with a comfortable viewing angle that helps to fix your posture and reduce neck and back strain (tips: for large-sized devices lower the height and adjust a suitable angle for better stability). Non-slip design: The back and bottom of this phone stand are fully covered with non-slip silicone, to provide maximum protection for your device against scratches and slips. User-friendly design: It features a reserved charging hole so you can charge your devices while using this stand. The circular cable organizer design helps organize the cables, without worrying about tangles. This phone stand will not block the subtitles when watching videos. -- - - - (Product includes: 1 phone stand, 1 screw, 1 hex screwdriver, 1 product specification).',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1683662124/Productos%20Amazonas/a1_jcd5qx.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1683662125/Productos%20Amazonas/a2_yoawhq.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1683662125/Productos%20Amazonas/a3_ojcplb.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1683662126/Productos%20Amazonas/ab_iznztl.jpg',
        brand: 'Lisen',
        rate: 3,
        quantity: 23
    },
    {
        id: 'zomlf5cgqi9p',
        title: 'Asus ROG Phone 5s',
        price: 1300,
        category: 'Cellphones',
        description: 'All-new performance with Snapdragon 888 Plus 5G, Qualcomm\'s latest Snapdragon 888 Plus 5G mobile platform offers ultra-fast performance. It features advanced 5G capabilities, AI processing, enhanced Wi-Fi 6, and global 5G multi-SIM support. With up to 18 GB of LPDDR5 RAM and 512 GB of UFS 3.1 ROM, you can rely on ROG Phone 5s to deliver the ultimate performance for a super-smooth gaming experience. Maximum cooling: To keep ROG Phone 5s cool during long gaming sessions, it is equipped with the exclusive GameCool 5 cooling system, with an AeroActive Cooler 5 and a 3D vapor chamber that effectively removes heat. With all these thermal innovations, nothing can hold you back in your quest for victory! Amazing 144 Hz AMOLED display: The 144 Hz/1 ms AMOLED display is built by Samsung and offers Delta-E<1 color accuracy and HDR10+ support to ensure vivid and stunning visuals. The incredible 300 Hz touch sampling rate provides an almost instant response for every touch, and the Always-On HDR technology enhances non-HDR visuals, making them more immersive. -GameFX audio system: The GameFX audio system of ROG Phone 5s features symmetrical 7-magnet dual speakers that fire forward for truly balanced stereo sound effects. There\'s also an optimized 3.5 mm headphone jack and a Hi-Fi ESS DAC to provide pristine and detailed audio. AirTrigger 5 for total control: The AirTrigger 5 control system gives you control like no other phone, with ultrasonic sensors that can be customized to activate any action you like and game movement controls, with special motions such as sliding, swiping, and lifting. Ultrasonic side sensors: ROG Phone 5s features specially calibrated side sensors that detect the movements of your fingers on the phone, allowing you to activate virtual buttons that enhance your gaming experience. Customizable lighting: ROG Phone 5s features an illuminated ROG logo with customizable colors and effects to let you personalize your device. 6,000 mAh battery: The 6,000 mAh battery is designed to support your gaming needs, with quick charging technology that lets you charge your phone faster.',
        images: ['https://res.cloudinary.com/silviajcn/image/upload/v1642289141/Productos%20Amazonas/l8k2mswkvj6nohp1gvzl.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642289148/Productos%20Amazonas/p8lgri16b0ie6qozcvvq.jpg', 'https://res.cloudinary.com/silviajcn/image/upload/v1642289155/Productos%20Amazonas/zxwvdvu9g0g2khvcl56n.jpg'],
        banner: 'https://res.cloudinary.com/silviajcn/image/upload/v1642289160/Productos%20Amazonas/j2rqnpdpbrn8debn0kjz.jpg',
        brand: 'Asus',
        rate: 2,
        quantity: 16
    }
];


export const addProductsToFirestore = async () => {
  const collectionRef = collection(db, 'products');

  try {
    for (const product of products) {
      await addDoc(collectionRef, product);
      console.log(`Product ${product.title} added to Firestore.`);
    }
    console.log('All products added to Firestore.');
  } catch (error) {
    console.error('Error adding products to Firestore:', error);
  }
};

export  const fetchProducts = async () => {
    try {
      // Reference to the 'products' collection
      const productsCollection = collection(db, 'products');
      
      // Fetch all documents from the collection
      const querySnapshot = await getDocs(productsCollection);
      
      // Map through the documents and extract data
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Log the products or do something with them
    //   console.log(products);
      return products;
    } catch (error) {
      console.error('Error fetching products from Firestore:', error);
    }
  };


  export const addUserToFirestore = async (userData) => {
    try {
      // Remove undefined fields from userData
      const filteredUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, v]) => v !== undefined)
      );
  
      const docRef = await addDoc(collection(db, "users"), filteredUserData);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding/updating user in Firestore: ", error);
    }
  };


