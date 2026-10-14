export interface SurahMeta {
  number: number;
  name: string;
  nameArabic: string;
  translation: string;
  totalAyat: number;
}

// 37 Surahs in Juz 30 (Surah 78 An-Naba to Surah 114 An-Nas)
export const JUZ_30_SURAHS: SurahMeta[] = [
  { number: 78, name: "An-Naba'", nameArabic: "النبأ", translation: "Berita Besar", totalAyat: 40 },
  { number: 79, name: "An-Nazi'at", nameArabic: "النازعات", translation: "Malaikat-Malaikat Yang Mencabut", totalAyat: 46 },
  { number: 80, name: "'Abasa", nameArabic: "عبس", translation: "Ia Bermuka Masam", totalAyat: 42 },
  { number: 81, name: "At-Takwir", nameArabic: "التكوير", translation: "Menggulung", totalAyat: 29 },
  { number: 82, name: "Al-Infitar", nameArabic: "الانفطار", translation: "Terbelah", totalAyat: 19 },
  { number: 83, name: "Al-Muthaffifin", nameArabic: "المطففين", translation: "Orang-Orang Yang Curang", totalAyat: 36 },
  { number: 84, name: "Al-Insyiqaq", nameArabic: "الانشقاق", translation: "Terbelah", totalAyat: 25 },
  { number: 85, name: "Al-Buruj", nameArabic: "البروج", translation: "Gugusan Bintang", totalAyat: 22 },
  { number: 86, name: "At-Tariq", nameArabic: "الطارق", translation: "Yang Datang di Malam Hari", totalAyat: 17 },
  { number: 87, name: "Al-A'la", nameArabic: "الأعلى", translation: "Yang Paling Tinggi", totalAyat: 19 },
  { number: 88, name: "Al-Ghasyiyah", nameArabic: "الغاشية", translation: "Hari Pembalasan", totalAyat: 26 },
  { number: 89, name: "Al-Fajr", nameArabic: "الفجر", translation: "Fajar", totalAyat: 30 },
  { number: 90, name: "Al-Balad", nameArabic: "البلد", translation: "Negeri", totalAyat: 20 },
  { number: 91, name: "Asy-Syams", nameArabic: "الشمس", translation: "Matahari", totalAyat: 15 },
  { number: 92, name: "Al-Lail", nameArabic: "الليل", translation: "Malam", totalAyat: 21 },
  { number: 93, name: "Ad-Duha", nameArabic: "الضحى", translation: "Waktu Duha", totalAyat: 11 },
  { number: 94, name: "Asy-Syarh", nameArabic: "الشرح", translation: "Melapangkan", totalAyat: 8 },
  { number: 95, name: "At-Tin", nameArabic: "التين", translation: "Buah Tin", totalAyat: 8 },
  { number: 96, name: "Al-'Alaq", nameArabic: "العلق", translation: "Segumpal Darah", totalAyat: 19 },
  { number: 97, name: "Al-Qadr", nameArabic: "القدر", translation: "Kemuliaan", totalAyat: 5 },
  { number: 98, name: "Al-Bayyinah", nameArabic: "البينة", translation: "Bukti Nyata", totalAyat: 8 },
  { number: 99, name: "Az-Zalzalah", nameArabic: "الزلزلة", translation: "Kegoncangan", totalAyat: 8 },
  { number: 100, name: "Al-'Adiyat", nameArabic: "العاديات", translation: "Kuda Perang", totalAyat: 11 },
  { number: 101, name: "Al-Qari'ah", nameArabic: "القارعة", translation: "Hari Kiamat", totalAyat: 11 },
  { number: 102, name: "At-Takasur", nameArabic: "التكاثر", translation: "Bermegah-Megahan", totalAyat: 8 },
  { number: 103, name: "Al-'Asr", nameArabic: "العصر", translation: "Masa / Waktu", totalAyat: 3 },
  { number: 104, name: "Al-Humazah", nameArabic: "الهمزة", translation: "Pengumpat", totalAyat: 9 },
  { number: 105, name: "Al-Fil", nameArabic: "الفيل", translation: "Gajah", totalAyat: 5 },
  { number: 106, name: "Quraisy", nameArabic: "قريش", translation: "Suku Quraisy", totalAyat: 4 },
  { number: 107, name: "Al-Ma'un", nameArabic: "الماعون", translation: "Barang Berguna", totalAyat: 7 },
  { number: 108, name: "Al-Kausar", nameArabic: "الكوثر", translation: "Nikmat Yang Banyak", totalAyat: 3 },
  { number: 109, name: "Al-Kafirun", nameArabic: "الكافرون", translation: "Orang-Orang Kafir", totalAyat: 6 },
  { number: 110, name: "An-Nasr", nameArabic: "النصر", translation: "Pertolongan", totalAyat: 3 },
  { number: 111, name: "Al-Lahab", nameArabic: "اللهب", translation: "Gejolak Api", totalAyat: 5 },
  { number: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", translation: "Memurnikan Keesaan Allah", totalAyat: 4 },
  { number: 113, name: "Al-Falaq", nameArabic: "الفلق", translation: "Waktu Subuh", totalAyat: 5 },
  { number: 114, name: "An-Nas", nameArabic: "الناس", translation: "Manusia", totalAyat: 6 }
];

export const IQRO_LEVELS = [
  "Iqro Jilid 1",
  "Iqro Jilid 2",
  "Iqro Jilid 3",
  "Iqro Jilid 4",
  "Iqro Jilid 5",
  "Iqro Jilid 6",
  "Al-Qur'an Juz 'Amma",
  "Al-Qur'an Binnazhar (30 Juz)"
];

export interface DoaMeta {
  id: string;
  name: string;
  arabic: string;
  latin: string;
  meaning: string;
}

export const DOA_LIST_DATA: DoaMeta[] = [
  {
    id: "doa-1",
    name: "Doa Kebaikan Kedua Orang Tua",
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    latin: "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa",
    meaning: "Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka sebagaimana mereka menyayangiku di waktu kecil."
  },
  {
    id: "doa-2",
    name: "Doa Sebelum Makan",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    latin: "Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban naar",
    meaning: "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka."
  },
  {
    id: "doa-3",
    name: "Doa Sesudah Makan",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    latin: "Alhamdulillahilladzi ath'amanaa wa saqaanaa wa ja'alanaa muslimiin",
    meaning: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang muslim."
  },
  {
    id: "doa-4",
    name: "Doa Sebelum Tidur",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ",
    latin: "Bismikallahumma ahyaa wa amuutu",
    meaning: "Dengan nama-Mu ya Allah, aku hidup dan aku mati."
  },
  {
    id: "doa-5",
    name: "Doa Bangun Tidur",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahilladzi ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur",
    meaning: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami kembali."
  },
  {
    id: "doa-6",
    name: "Doa Sebelum Belajar",
    arabic: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا",
    latin: "Rabbi zidnii 'ilman warzuqnii fahman",
    meaning: "Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan dan berilah aku rezeki pemahaman."
  },
  {
    id: "doa-7",
    name: "Doa Masuk Masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allahummaftah lii abwaaba rahmatik",
    meaning: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu."
  },
  {
    id: "doa-8",
    name: "Doa Keluar Masjid",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    latin: "Allahumma innii as-aluka min fadhlik",
    meaning: "Ya Allah, sesungguhnya aku memohon karunia kepada-Mu."
  },
  {
    id: "doa-9",
    name: "Doa Masuk Kamar Mandi",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    latin: "Allahumma innii a'uudzu bika minal khubutsi wal khabaa-its",
    meaning: "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan setan laki-laki dan setan perempuan."
  },
  {
    id: "doa-10",
    name: "Doa Keluar Kamar Mandi",
    arabic: "غُفْرَانَكَ ، الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي",
    latin: "Ghufranak, alhamdulillahilladzi adzhaba 'annil adzaa wa 'aafaanii",
    meaning: "Aku mohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kotoran dariku dan menyehatkanku."
  },
  {
    id: "doa-11",
    name: "Doa Naik Kendaraan",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ",
    latin: "Subhaanal ladzii sakhkhara lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun",
    meaning: "Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami."
  },
  {
    id: "doa-12",
    name: "Doa Kebaikan Dunia & Akhirat",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin: "Rabbanaa aatinaa fid dunyaa hasanah wa fil aakhirati hasanah wa qinaa 'adzaaban naar",
    meaning: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa api neraka."
  }
];

export const DOA_HARIAN = DOA_LIST_DATA.map(d => d.name);

