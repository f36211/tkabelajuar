import json

data_path = r'c:\Users\fathu\Downloads\se\tkafinal\src\data\soal.json'

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_questions = [
  {
    "id": 101, "topik": "peluang", "tingkat": "mudah",
    "pertanyaan": "Sebuah dadu dilambungkan satu kali. Peluang muncul mata dadu faktor dari 6 adalah....",
    "opsi": ["1/6", "1/2", "2/3", "5/6"],
    "jawaban": 2,
    "pembahasan": "Faktor dari 6: 1, 2, 3, 6 (4 angka). Peluang = 4/6 = 2/3"
  },
  {
    "id": 102, "topik": "peluang", "tingkat": "sedang",
    "pertanyaan": "Sebuah keluarga ingin memiliki 2 anak saja. Jika peluang lahir anak laki-laki dan lahir anak perempuan sama, peluang kedua anaknya perempuan adalah....",
    "opsi": ["1/4", "1/2", "3/4", "1"],
    "jawaban": 0,
    "pembahasan": "Peluang {P,P} = 1/2 × 1/2 = 1/4"
  },
  {
    "id": 103, "topik": "geometri", "tingkat": "sedang",
    "pertanyaan": "Kebun berbentuk belah ketupat, panjang kedua diagonalnya 24 m dan 18 m. Di sekelilingnya ditanami pohon dengan jarak antar pohon 3 m. Banyaknya pohon adalah....",
    "opsi": ["14", "15", "20", "28"],
    "jawaban": 2,
    "pembahasan": "Diagonal 24 & 18. Sisi belah ketupat miring = √(12²+9²) = √225 = 15m. Keliling = 4×15 = 60m. Banyak pohon = 60/3 = 20"
  },
  {
    "id": 104, "topik": "fungsi", "tingkat": "sedang",
    "pertanyaan": "Persamaan garis melalui titik (-3,2) dan sejajar dengan garis 2x + 3y = 6 adalah....",
    "opsi": ["2x + 3y = -8", "2x + 3y = 0", "2x - 3y = -4", "2x - 3y = 0"],
    "jawaban": 1,
    "pembahasan": "m = -2/3. Persamaan: y - 2 = -2/3(x - (-3)) → 3y - 6 = -2x - 6 → 2x + 3y = 0"
  },
  {
    "id": 105, "topik": "aljabar", "tingkat": "mudah",
    "pertanyaan": "Penyelesaian sistem persamaan x + y = 7 dan x - y = 3 adalah....",
    "opsi": ["(2,5)", "(5,2)", "(-3,10)", "(10,-3)"],
    "jawaban": 1,
    "pembahasan": "x+y=7, x-y=3. Tambah dua persamaan: 2x=10 → x=5. Substitusi x=5 ke 5+y=7 → y=2. Jadi (5,2)"
  },
  {
    "id": 106, "topik": "aljabar", "tingkat": "mudah",
    "pertanyaan": "Penyelesaian dari 3x + 10 > 6x - 8 adalah....",
    "opsi": ["x < 2", "x > 2", "x < 6", "x > 6"],
    "jawaban": 2,
    "pembahasan": "3x - 6x > -8 - 10 → -3x > -18 → (Karna dibagi dg -3 maka tanda dibalik) x < 6"
  },
  {
    "id": 107, "topik": "himpunan", "tingkat": "sedang",
    "pertanyaan": "Dari 143 siswa, 95 siswa senang matematika, 87 siswa senang fisika, dan 60 siswa senang keduanya. Banyak siswa yang tidak senang matematika maupun fisika adalah....",
    "opsi": ["21 orang", "27 orang", "35 orang", "122 orang"],
    "jawaban": 0,
    "pembahasan": "Gabungan (Union) = 95 + 87 - 60 = 122. Tidak senang keduanya = Total siswa - Union = 143 - 122 = 21 orang"
  },
  {
    "id": 108, "topik": "himpunan", "tingkat": "sedang",
    "pertanyaan": "Diketahui K = {bilangan prima antara 2 dan 12}. Dan L = {4 bilangan kelipatan 3 yang pertama}. K ∩ L adalah....",
    "opsi": ["{3,6,9,12}", "{3,6,9}", "{3,6}", "{3}"],
    "jawaban": 3,
    "pembahasan": "K = {3,5,7,11}, L = {3,6,9,12}. Irisan himpunan K ∩ L adalah elemen yang sama di kedua himpunan = {3}"
  },
  {
    "id": 109, "topik": "fungsi", "tingkat": "mudah",
    "pertanyaan": "Diketahui suatu fungsi f(x) = 2x - 3. Nilai f(-1) adalah....",
    "opsi": ["5", "1", "-1", "-5"],
    "jawaban": 3,
    "pembahasan": "Untuk memecahkan cukup substitusi x=-1: f(-1) = 2(-1) - 3 = -2 - 3 = -5"
  },
  {
    "id": 110, "topik": "fungsi", "tingkat": "mudah",
    "pertanyaan": "Diketahui f(x) = 8 - 2x, jika f(a) = -2, maka nilai a adalah....",
    "opsi": ["-5", "-3", "3", "5"],
    "jawaban": 3,
    "pembahasan": "Substitusi nilai ke x: 8 - 2a = -2 → -2a = -2 - 8 = -10 → a = 5"
  },
  {
    "id": 111, "topik": "aljabar", "tingkat": "mudah",
    "pertanyaan": "Hasil dari -6 + (6 : (-2)) - ((-3) × 3) adalah....",
    "opsi": ["0", "3", "6", "9"],
    "jawaban": 0,
    "pembahasan": "Dahulukan pembagian & perkalian: -6 + (-3) - (-9) = -9 + 9 = 0"
  },
  {
    "id": 112, "topik": "aritmatika-sosial", "tingkat": "mudah",
    "pertanyaan": "Tali yang panjangnya 10 meter akan dipotong menjadi beberapa bagian yang sama panjang. Jika tiap bagian panjangnya 1/4 meter, maka banyak potongan tali yang terjadi adalah....",
    "opsi": ["30", "35", "40", "45"],
    "jawaban": 2,
    "pembahasan": "Potongan tali dihitung dengan membagi panjang total dengan panjang tiap bagian: 10 / (1/4) = 10 × 4 = 40 potongan"
  },
  {
    "id": 113, "topik": "aritmatika-sosial", "tingkat": "mudah",
    "pertanyaan": "Untuk membuat 20 roti diperlukan 4 kg tepung terigu. Banyaknya tepung terigu yang diperlukan untuk membuat 50 roti tersebut adalah....",
    "opsi": ["8 kg", "10 kg", "12 kg", "14 kg"],
    "jawaban": 1,
    "pembahasan": "Rasio: 20 roti = 4 kg. 1 kg = 5 roti. 50 roti = 50/5 = 10 kg tepung"
  },
  {
    "id": 114, "topik": "aritmatika-sosial", "tingkat": "sedang",
    "pertanyaan": "Suatu proyek diselesaikan oleh 30 pekerja dalam 6 bulan. Jika proyek itu harus diselesaikan dalam 4 bulan, maka banyaknya pekerja yang harus ditambah sebanyak....",
    "opsi": ["10 orang", "15 orang", "20 orang", "25 orang"],
    "jawaban": 1,
    "pembahasan": "Sistem beban = 30 × 6 = 180 bulan-pekerja. 180 / 4 = 45 pekerja. Tambahan = 45 - 30 = 15 orang"
  },
  {
    "id": 115, "topik": "aljabar", "tingkat": "sedang",
    "pertanyaan": "Bentuk sederhana dari 12/(√6 - √2) adalah....",
    "opsi": ["3(√2 - √6)", "3(√2 + √6)", "3(√6 + √2)", "3(√6 - √2)"],
    "jawaban": 2,
    "pembahasan": "Gunakan bentuk sekawan: 12/(√6 - √2) × (√6 + √2)/(√6 + √2) = 12(√6 + √2) / (6 - 2) = 12(√6 + √2) / 4 = 3(√6 + √2)"
  },
  {
    "id": 116, "topik": "fungsi", "tingkat": "mudah",
    "pertanyaan": "Diketahui rumus fungsi f(x) = 6 - 3x. Nilai dari f(5) + f(-4) adalah....",
    "opsi": ["18", "9", "-15", "-27"],
    "jawaban": 1,
    "pembahasan": "Hitung satu-satu: f(5) = 6 - 15 = -9. f(-4) = 6 - (-12) = 18. f(5) + f(-4) = -9 + 18 = 9"
  },
  {
    "id": 117, "topik": "statistika", "tingkat": "sedang",
    "pertanyaan": "Tabel nilai ulangan matematika mengurutkan nilai dari 4 hingga 10 dengan frekuensi masing-masing: 3, 2, 5, 8, 5, 4, 3. Banyak siswa yang mendapat nilai di atas rata-rata adalah....",
    "opsi": ["25 orang", "20 orang", "12 orang", "7 orang"],
    "jawaban": 2,
    "pembahasan": "Total siswa = 30. Total nilai = (4×3)+(5×2)+(6×5)+(7×8)+(8×5)+(9×4)+(10×3) = 214. Rata-rata = 214/30 = 7.13. Nilai > 7.13 adalah 8,9,10 dengan frekuensi 5+4+3 = 12 orang."
  },
  {
    "id": 118, "topik": "statistika", "tingkat": "mudah",
    "pertanyaan": "Tabel Distribusi Tinggi Badan. Tinggi Badan(cm): 148, 150, 152, 154, 156, 158, 160. Banyak Siswa: 2, 4, 7, 8, 5, 6, 3. Modus tinggi badan siswa adalah .... cm",
    "opsi": ["152", "153", "154", "155"],
    "jawaban": 2,
    "pembahasan": "Modus adalah nilai dengan frekuensi terbesar. Frekuensi tertinggi pada interval data ada di angka 8, yang mewakili tinggi 154 cm."
  },
  {
    "id": 119, "topik": "statistika", "tingkat": "sedang",
    "pertanyaan": "Dalam suatu kelas terdapat 40 orang, 21 diantaranya perempuan. Nilai rataan ulangan Matematika siswa perempuan adalah 68, sedangkan nilai rataan siswa laki-laki 62. Nilai rata-rata kelasnya adalah....",
    "opsi": ["66", "65,15", "65,5", "64"],
    "jawaban": 1,
    "pembahasan": "Perempuan=21, Laki-laki=19. Total nilai keseluruhan=(21×68 + 19×62)/40 = (1428 + 1178)/40 = 2606 / 40 = 65,15"
  },
  {
    "id": 120, "topik": "geometri", "tingkat": "sedang",
    "pertanyaan": "Sebuah taman berbentuk lingkaran dengan diameter 14 meter akan ditanami bunga. Harga tanaman bunga adalah Rp 100.000,00/m². Biaya yang harus dikeluarkan untuk membeli tanaman bunga adalah....",
    "opsi": ["Rp 15.400.000,00", "Rp 15.800.000,00", "Rp 16.400.000,00", "Rp 18.600.000,00"],
    "jawaban": 0,
    "pembahasan": "r = 7m. Menggunakan π = 22/7, Luas = (22/7)×7² = 154 m². Biaya keseluruhan = 154 × 100.000 = 15.400.000"
  },
  {
    "id": 121, "topik": "statistika", "tingkat": "mudah",
    "pertanyaan": "Diketahui A = {bilangan asli kurang dari 10}, B = {bilangan prima kurang dari 15}. Peluang muncul anggota yang sama pada kedua himpunan adalah....",
    "opsi": ["10/15", "4/15", "4/11", "11/15"],
    "jawaban": 2,
    "pembahasan": "A={1,2,3,4,5,6,7,8,9} (9 elemen). B={2,3,5,7,11,13} (6 elemen). Irisan A∩B={2,3,5,7} (4 elemen). Peluang sama (n(A∩B) / n(A∪B)). Gabungan elemen unik = 11. Peluang = 4/11"
  },
  {
    "id": 122, "topik": "aljabar", "tingkat": "sedang",
    "pertanyaan": "Harga setengah kilogram cabe rawit pada hari ini adalah Rp35.000,00. Jika hari ini Ibu membeli cabe rawit seberat 2 1/4 kilogram, total harga yang harus dibayar Ibu adalah....",
    "opsi": ["Rp175.000,00", "Rp157.500,00", "Rp140.000,00", "Rp87.500,00"],
    "jawaban": 1,
    "pembahasan": "1/2 kg = Rp35.000 → 1 kg = Rp70.000. Ibu beli 2 1/4 kg (2.25 kg) = 2.25 × 70.000 = 157.500"
  },
  {
    "id": 123, "topik": "geometri", "tingkat": "mudah",
    "pertanyaan": "Seorang anak mengendarai sepeda jari-jari roda 35 cm. Roda berputar 30 kali. Jarak yang ditempuh adalah .... m",
    "opsi": ["60", "65", "66", "70"],
    "jawaban": 2,
    "pembahasan": "Keliling = 2×π×r = 2×(22/7)×35 = 220 cm = 2.2 m. 30 putaran = 30 × 2.2 = 66 m"
  },
  {
    "id": 124, "topik": "aljabar", "tingkat": "mudah",
    "pertanyaan": "Perbandingan antara jumlah siswa laki-laki dan perempuan di kelas 4:5. Selisih laki-laki dan perempuan 4 orang. Jumlah siswa kelas tersebut?",
    "opsi": ["18", "20", "36", "45"],
    "jawaban": 2,
    "pembahasan": "Rasio Perbedaan = 5 - 4 = 1. Selisih riil = 4, maka pengali rasio = 4. Jumlah rasio = 4+5 = 9. Total = 9 × 4 = 36 siswa"
  },
  {
    "id": 125, "topik": "aljabar", "tingkat": "sedang",
    "pertanyaan": "Yudi persediaan air 3 liter. Pagi 2/3L, Siang 1/2L, Sore 7/10L, Malam 2/5L. Sisa air?",
    "opsi": ["2 4/15", "11/15", "2/5", "3/5"],
    "jawaban": 1,
    "pembahasan": "Total = 2/3 + 1/2 + 7/10 + 2/5 = 20/30 + 15/30 + 21/30 + 12/30 = 68/30 = 34/15 = 2 4/15 liter. 3 - 2 4/15 = 11/15 liter"
  }
]

# Append new questions to 'ujian' array. Also append them to 'latihan' array for abundance.
data['ujian'].extend(new_questions)
data['latihan'].extend(new_questions)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("done")
