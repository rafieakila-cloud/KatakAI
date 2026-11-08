'use strict';

/* ============================================================
   KATAK AI — Kurikulum Kodok: 10 bab coding lewat cerita fantasi
   Konten kurasi Buggames. Cerdas, lucu, dan gratis selamanya.
   ============================================================ */

const BABS = [
  {
    id: 1, icon: 'seed', title: 'Hutan Variabel', konsep: 'Variabel & tipe data', xp: 30,
    story: `Kamu tersesat di Hutan Variabel 🌲✨. Di depanmu, seekor kodot tua membuka daun lebar dan berkata: "Setiap penyimpanan di hutan ini butuh NAMA dan ISI. Sebut namanya, masukkan isinya — jangan terbalik!"\n\nKodok itu menulis di pasir:\n\n      nama = "Rani"\n      umur = 17\n\n"Yang atas kotak bernama NAMA berisi teks. Yang bawah kotak UMUR berisi angka. Teks selalu diapit tanda kutip — angka tidak usah."\n\nLantai hutan bergetar. Kotak-kotak kecil melayang dan menaruh hasil kembalian: setiap kali kodok memanggil \`nama\`, yang muncul adalah Rani. Setiap kali memanggil \`umur\`, muncullah 17.\n\n"Inilah variabel, Ksatria," bisik kodok tua itu. "Ingat satu hal: satu kotak, satu nama, satu isi. Ganti isinya kapan pun kamu mau — tapi namanya jangan sampai kabur."\n\nDi ujung hutan, gerbang baru terbuka. Di atasnya tertulis: **HUTAN KONDISIONAL — LEBAH YANG BISA MEMUTUSKAN**.`,
    code: `nama = "Rani"      # teks (string)\numur = 17           # angka bulat (int)\njumlah = 3.5        # angka desimal (float)\naktif = True        # boolean\n\nprint(nama, umur)   # Rani 17`,
    quiz: [
      { q: 'Apa itu variabel?', options: ['Tempat menyimpan data yang punya nama', 'Bahasa pemrograman', 'Jenis komputer', 'Kelompok fungsi'], answer: 0 },
      { q: 'Penulisan string yang benar adalah…', options: ['nama = Rani', 'nama = "Rani"', '"nama" = Rani', 'nama := Rani!'], answer: 1 },
      { q: 'umur = 17 — tipe datanya apa?', options: ['String', 'Boolean', 'Int', 'Float'], answer: 2 },
      { q: 'Apa yang terjadi kalau kita tulis nama = "Rani" lalu nama = "Budi"?', options: ['Error', 'Isinya jadi "Budi"', 'Tetap "Rani"', 'Program berhenti'], answer: 1 },
    ],
  },
  {
    id: 2, icon: 'bee', title: 'Lebah Kondisional', konsep: 'if / elif / else', xp: 35,
    story: `Di sarang lebah raksasa, seekor lebah penjaga menghadang jalanmu 🐝. "Kamu boleh LEWAT ke Taman Kode hanya jika kamu bisa MENENTUKAN — bukan asal ikut arus!"\n\nLebah itu menunjuk dua jalan. "Jika hujan, lewat KORIDOR basah. Jika tidak hujan, lewat KEBUN bunga. Jika kamu takut lebah… yah, tetap harus lewat salah satu."\n\n      if hujan:\n          lewat = "koridor"\n      else:\n          lewat = "kebun"\n\n"Dan jika ada TIGA kemungkinan? Pakai elif — else if yang disingkat!" lebah itu menambahkan sambil tertawa kecil.\n\nKuncinya: mesin hanya bisa satu keputusan jika kondisi bernilai TRUE. Jika semua FALSE, jatuh ke else. Tidak ada jalan tengah — dunia program bukan dunia ragu-ragu.\n\nGerbang Taman Kode terbuka dengan bunyi klik halus.`,
    code: `hujan = False\n\nif hujan:\n    lewat = "koridor basah"\nelif kehujanan_gerimis:\n    lewat = "lorong payung"\nelse:\n    lewat = "kebun bunga"\n\nprint("Jalan:", lewat)`,
    quiz: [
      { q: 'Apa fungsi "if"?', options: ['Menyelesaikan loop', 'Menjalankan kode hanya jika kondisi benar', 'Mencetak teks', 'Membuat variabel'], answer: 1 },
      { q: 'Blok kode mana yang dijalankan jika semua kondisi FALSE?', options: ['if', 'elif', 'else', 'return'], answer: 2 },
      { q: 'Kata kunci untuk kondisi tengah-tengah adalah…', options: ['elseif', 'else if', 'elif', 'antara'], answer: 2 },
      { q: 'Apa hasil dari: x = 5; if x > 3: jalan = "A" else: jalan = "B"', options: ['A', 'B', 'Error', 'Tidak ada jawaban'], answer: 0 },
    ],
  },
  {
    id: 3, icon: 'gorilla', title: 'Gorila Perulangan', konsep: 'for & while', xp: 40,
    story: `Kamu bertemu seekor gorila perak di tengah hutan, dan gorila itu sedang memukul-mukul dada sambil berhitung: 1… 2… 3… 4… 5… berkali-kali, tanpa bosan 🦍.\n\n"Aku tidak lelah," geramnya. "Aku cuma melakukan hal yang SAMA berulang-ulang. Begitulah mesin bekerja — kamu manusia mudah bosan, mesin tidak!"\n\n      for i in range(5):\n          print("Kumonang!", i + 1)\n\n"for = ulangi sebanyak N kali. While = ulangi selama kondisi masih benar. Jangan sampai loop tidak pernah berhenti — itu namanya LOOP TAK BERAKHIR, malapetaka!"\n\nGorila tertawa parau. "Kalau kau bisa menghitung sampai 1000 dengan satu baris kode, barulah aku percaya."`,
    code: `for i in range(5):\n    print("Kumonang!", i + 1)\n\n# while: ulangi selama benar\nangka = 1\nwhile angka <= 5:\n    print("Angka:", angka)\n    angka += 1`,
    quiz: [
      { q: 'Kapan "for" digunakan?', options: ['Sekali jalan saja', 'Mengulang sesuai jumlah tertentu', 'Membuat kondisi', 'Menghentikan program'], answer: 1 },
      { q: 'range(5) menghasilkan angka apa saja?', options: ['1–5', '0–5', '0–4', '1–4'], answer: 2 },
      { q: 'Kapan "while" berhenti bekerja?', options: ['Tidak pernah', 'Ketika kondisinya FALSE', 'Setelah 10 kali', 'Saat error'], answer: 1 },
      { q: 'Bahaya loop yang tidak pernah FALSE adalah…', options: ['Program lebih cepat', 'Program berhenti sendiri', 'Infinite loop — program hang', 'Memori penuh terlalu cepat'], answer: 2 },
    ],
  },
  {
    id: 4, icon: 'wizard', title: 'Penyihir Fungsi', konsep: 'function & return', xp: 40,
    story: `Menara tertinggi hutan ditinggali seorang Penyihir Fungsi 🧙‍♂️. Di depannya bergantungan gulungan-gulungan mantra, masing-masing bertuliskan nama: SAPA, TAMBAH, HITUNG_LUAS.\n\n"Setiap mantra adalah FUNGSI," katanya. "Mantra ini TIDAK BERJALAN sampai kamu PANGGIL dengan menyebut namanya. Dan ketika dipanggil, ia mengerjakan satu hal dan, jika mau, MEMBERIKAN sesuatu kembali — itulah return."\n\n      def sapa(nama):\n          return "Halo " + nama\n\n      print(sapa("Rani"))\n\n"Keuntungan fungsi: tulis SEKALI, pakai BERKALI-KALI. Program besar = kumpulan fungsi kecil yang bekerja sama, bukan satu langkah raksasa."\n\nPenyihir itu melambaikan tongkat. "Sekarang, buat satu mantra bernama TAMBAH yang menerima dua angka dan memberikan hasilnya."`,
    code: `def sapa(nama):\n    return "Halo " + nama\n\ndef tambah(a, b):\n    return a + b\n\nprint(sapa("Rani"))      # Halo Rani\nprint(tambah(3, 4))       # 7`,
    quiz: [
      { q: 'Apa itu fungsi?', options: ['Blok kode yang bisa dipanggil berkali-kali', 'Variabel khusus', 'Jenis loop', 'Data baru'], answer: 0 },
      { q: 'Apa fungsi keyword "return"?', options: ['Mengulang kode', 'Memberikan nilai kembali ke pemanggil', 'Menghentikan program', 'Menampilkan teks'], answer: 1 },
      { q: 'Kapan isi fungsi dieksekusi?', options: ['Saat didefinisikan', 'Saat di-import', 'Saat dipanggil', 'Saat program ditutup'], answer: 2 },
      { q: 'Apa keuntungan fungsi?', options: ['Kode lebih pendek tapi tidak jelas', 'Tulis sekali, pakai berkali-kali', 'Program jadi lebih lambat', 'Tidak perlu parameter'], answer: 1 },
    ],
  },
  {
    id: 5, icon: 'books', title: 'Perpustakaan Array', konsep: 'list & indeks', xp: 45,
    story: `Kamu memasuki Perpustakaan Array — rak-rak buku tak berujung yang tersusun rapi dengan nomor di setiap rak 📚.\n\nSang Pustakawan berbisik: "Satu rak boleh berisi banyak buku. Dan setiap buku punya NOMOR RAK — dimulai dari NOL, bukan SATU. Peti pertama = indeks 0!"\n\n      buah = ["apel", "jeruk", "mangga"]\n      print(buah[0])   # apel\n      print(buah[2])   # mangga\n\n"Mau menambah buku? Pakai append(). Mau menghitung isi rak? Pakai len(). Mau melihat satu nomor rak tertentu? Kurung siku!"\n\nDi ujung perpustakaan, sebuah label rak bertuliskan: **MENARA OBJEK — KELAS-KELAS YANG HIDUP**.`,
    code: `buah = ["apel", "jeruk", "mangga"]\n\nprint(buah[0])      # apel\nprint(len(buah))    # 3\nbuah.append("pisang")\nprint(buah)         # ['apel', 'jeruk', 'mangga', 'pisang']`,
    quiz: [
      { q: 'Dari indeks berapa array/list dimulai?', options: ['1', '0', '-1', 'Bebas'], answer: 1 },
      { q: 'buah[1] dari ["apel", "jeruk", "mangga"] adalah…', options: ['apel', 'jeruk', 'mangga', 'Error'], answer: 1 },
      { q: 'Fungsi untuk menambah elemen di akhir list?', options: ['add()', 'push()', 'append()', 'insert()'], answer: 2 },
      { q: 'len(buah) mengembalikan…', options: ['Indeks terakhir', 'Jumlah elemen', 'Elemen pertama', 'Panjang teks'], answer: 1 },
    ],
  },
  {
    id: 6, icon: 'tower', title: 'Menara Objek', konsep: 'class & object', xp: 50,
    story: `Di atas tebing berdiri Menara Objek, dihuni oleh PARA ARSITEK 🏰. Setiap arsitek merancang CETAKAN — cetak biru sebuah hal. Satu cetak biru Kucing bisa menghasilkan SERATUS kucing nyata.\n\n"Cetakan itu CLASS," kata sang Arsitek Utama. "Hasil cetakannya OBJECT. Class mendefinisikan apa yang DIMILIKI (atribut) dan apa yang BISA DILAKUKAN (method)."\n\n      class Kucing:\n          def __init__(self, nama):\n              self.nama = nama\n\n          def suara(self):\n              return "Meong!"\n\n      rani = Kucing("Rani")\n      print(rani.suara())\n\n"self artinya 'aku sendiri' — objek yang sedang dipakai. Setiap objek punya datanya sendiri meski berasal dari cetakan yang sama."`,
    code: `class Kucing:\n    def __init__(self, nama):\n        self.nama = nama\n\n    def suara(self):\n        return self.nama + " berkata: Meong!"\n\nrani = Kucing("Rani")\nbudi = Kucing("Budi")\n\nprint(rani.suara())\nprint(budi.suara())`,
    quiz: [
      { q: 'Apa itu class?', options: ['Hasil cetakan objek', 'Cetak biru/rancangan untuk membuat objek', 'Variabel biasa', 'Loop khusus'], answer: 1 },
      { q: 'Apa itu object?', options: ['Cetakan', 'Hasil nyata dari cetakan class', 'Fungsi spesial', 'Tipe data'], answer: 1 },
      { q: 'Apa arti "self" di method class?', options: ['Nilai kembali', 'Objek itu sendiri', 'Parameter bebas', 'Fungsi utama'], answer: 1 },
      { q: 'Method yang dipanggil saat objek dibuat adalah…', options: ['start()', 'create()', '__init__()', 'main()'], answer: 2 },
    ],
  },
  {
    id: 7, icon: 'gate', title: 'Gerbang Async', konsep: 'async / await', xp: 55,
    story: `Di ujung hutan ada Gerbang Async — gerbang raksasa yang terbuka SENDIRI, tapi hanya setelah kau menunggu sesuatu datang 🛗.\n\nDi sana kau bertemu penjaga gerbang yang sedang minum teh sambil menunggu kiriman surat kaleng dari kota sebelah. "Dulu aku STANDBY di depan gerbang menunggu — itu sinkron, buang waktu! Sekarang aku ASYNC: aku serahkan menunggu pada sistem, lalu aku kerjakan hal lain."\n\n      import asyncio\n\n      async def ambil_surat():\n          await asyncio.sleep(2)\n          return "Surat sampai!"\n\n      async def main():\n          surat = await ambil_surat()\n          print(surat)\n\nasyncio.run(main())\n\n"await = menunggu, tapi tidak membekukan dunia. Sambil menunggu surat, aku bisa menyiram tanaman!" Kata sang penjaga sambil berdiri dan melambai.`,
    code: `import asyncio\n\nasync def ambil_surat():\n    await asyncio.sleep(1)\n    return "Surat sampai!"\n\nasync def main():\n    print("Menunggu surat...")\n    surat = await ambil_surat()\n    print(surat)\n\nasyncio.run(main())`,
    quiz: [
      { q: 'Apa arti async?', options: ['Program berjalan berurutan', 'Program bisa menunggu tanpa membekukan semuanya', 'Program lebih lambat', 'Program tanpa fungsi'], answer: 1 },
      { q: 'Apa fungsi "await"?', options: ['Menunggu hasil tanpa memblokir semua', 'Menghentikan program', 'Membuat loop', 'Menampilkan teks'], answer: 0 },
      { q: 'Apa kepanjangan Async/Await?', options: ['Asynchronous / menunggu', 'Asynch / await', 'Async / away', 'Async / awaiting'], answer: 0 },
      { q: 'Kapan async paling berguna?', options: ['Hitung angka besar', 'Menunggu jaringan/API', 'Sorting data', 'Print biasa'], answer: 1 },
    ],
  },
  {
    id: 8, icon: 'dragon', title: 'Naga API', konsep: 'REST API & HTTP', xp: 60,
    story: `Di puncak gunung bersarang Naga API — makhluk raksasa bersisik JSON, bernapas HTTP 🐉. Dia tidak mau kamu minta sesuatu dengan cara yang salah — ADA ATURAN.\n\n"AKU hanya bisa mengerti empat kata keramat: GET, POST, PUT, DELETE!" geramnya. "GET artinya LIHAT. POST artinya BUAT BARU. PUT artinya GANTI. DELETE artinya HAPUS. Salah satu saja kau gunakan tidak semestinya, aku akan murka!"\n\n      import requests\n\n      r = requests.get("https://jsonplaceholder.typicode.com/todos/1")\n      print(r.status_code)   # 200 = OK!\n      print(r.json())        # isi datanya\n\n"Dan jawabanku SELALU berupa angka keramat: 200 = sukses, 404 = tidak ditemukan, 500 = aku error!"\n\nNaga mengangkat kepalanya tinggi. "Bertahanlah menjaga kata-kata itu, dan kau akan menguasai komunikasi antar-mesin."`,
    code: `import requests\n\nr = requests.get("https://jsonplaceholder.typicode.com/todos/1")\nprint("Status:", r.status_code)\nprint("Data:", r.json())\n\n# 200 = OK | 404 = tidak ada | 500 = error server`,
    quiz: [
      { q: 'Method HTTP untuk MENGAMBIL data?', options: ['POST', 'GET', 'PUT', 'DELETE'], answer: 1 },
      { q: 'Method HTTP untuk MEMBUAT data baru?', options: ['GET', 'PUT', 'POST', 'DELETE'], answer: 2 },
      { q: 'Kode status 200 artinya…', options: ['Error', 'Tidak ditemukan', 'Sukses', 'Dilarang'], answer: 2 },
      { q: 'Kode status 404 artinya…', options: ['Sukses', 'Ditemukan', 'Tidak ditemukan', 'Server error'], answer: 2 },
    ],
  },
  {
    id: 9, icon: 'temple', title: 'Kuil Database', konsep: 'data & persistence', xp: 60,
    story: `Di bawah pegunungan berdiri Kuil Database — tempat semua data di dunia tersimpan dan dijaga oleh para pendeta data 🏛️.\n\nSang Kepala Pendeta menatapmu dari balik meja batu. "Kau ingat, ketika program MATI, semua isi variabel ikut HILANG. Itulah sebabnya data penting harus disimpan di database — tempat yang kekal."\n\n      import sqlite3\n\n      conn = sqlite3.connect("kodokyo.db")\n      conn.execute("CREATE TABLE IF NOT EXISTS kodok (nama TEXT)")\n      conn.execute("INSERT INTO kodok VALUES ('Rani')")\n      conn.commit()\n\n"Lihat: kita BUAT tabel, MASUKKAN data, lalu COMMIT — kata keramat yang berarti 'simpan permanen'. Tanpa commit, kuil tidak akan mengingatmu."`,
    code: `import sqlite3\n\nconn = sqlite3.connect("kodokyo.db")\nconn.execute("CREATE TABLE IF NOT EXISTS kodok (nama TEXT)")\nconn.execute("INSERT INTO kodok VALUES ('Rani')")\nconn.commit()\n\nfor row in conn.execute("SELECT * FROM kodok"):\n    print(row)`,
    quiz: [
      { q: 'Kenapa perlu database?', options: ['Biar program lebih cepat', 'Data tersimpan permanen walau program mati', 'Biar kode lebih pendek', 'Database gratis'], answer: 1 },
      { q: 'Perintah untuk menyimpan data permanen di SQLite?', options: ['save()', 'commit()', 'store()', 'push()'], answer: 1 },
      { q: 'Apa fungsi CREATE TABLE?', options: ['Menghapus data', 'Membuat tabel baru', 'Mengisi tabel', 'Membaca tabel'], answer: 1 },
      { q: 'Perintah membaca semua isi tabel?', options: ['SELECT * FROM', 'GET ALL', 'READ TABLE', 'SHOW ALL'], answer: 0 },
    ],
  },
  {
    id: 10, icon: 'knight', title: 'Ksatria Kode Terakhir', konsep: 'PROYEK AKHIR', xp: 100,
    story: `Ini dia — Gerbang Terakhir, dijaga oleh **Sang Ksatria Kode**, AI penjaga tertua hutan digital ⚔️.\n\n"Kau telah mengumpulkan sembilan kekuatan: Variabel, Kondisional, Perulangan, Fungsi, Array, Objek, Async, API, dan Database. Hari ini kau satukan SEMUANYA," katanya.\n\n"Buat program PERTAMA-mu yang utuh: sebuah aplikasi catatan kodok yang bisa menambah dan menampilkan nama-nama kodok yang kau temui."\n\n      nama = input("Nama kodok: ")\n      db.execute("INSERT INTO kodok VALUES (?)", (nama,))\n      for row in db.execute("SELECT * FROM kodok"):\n          print(row)\n\n"Satu input, satu database, satu loop, satu output — itulah roh programmer sejati. Bukan banyaknya kode yang kau tulis, tapi SAH-nya kode itu berjalan dari awal sampai akhir."\n\nGerbang perlahan terbuka. Di baliknya, Hutan Digital berkilau: kau bukan lagi murid.\n\n**Kau adalah Ksatria Kode.** 👑`,
    code: `import sqlite3\n\nconn = sqlite3.connect("kodokyo.db")\nconn.execute("CREATE TABLE IF NOT EXISTS kodok (nama TEXT)")\n\nnama = input("Nama kodok: ")\nconn.execute("INSERT INTO kodok VALUES (?)", (nama,))\nconn.commit()\n\nfor row in conn.execute("SELECT * FROM kodok"):\n    print("Kodok ditemukan:", row[0])`,
    quiz: [
      { q: 'Apa yang menyatukan semua konsep sebelumnya?', options: ['Mengetik cepat', 'Projek mini yang utuh dari input sampai output', 'Sintaks yang rumit', 'Versi Python terbaru'], answer: 1 },
      { q: 'Kenapa perlu commit() di akhir?', options: ['Supaya program tidak error', 'Supaya data tersimpan permanen', 'Supaya kode lebih pendek', 'Supaya bisa di-print'], answer: 1 },
      { q: 'Apa roh programmer sejati?', options: ['Banyak kode', 'Kode yang berjalan dari awal sampai akhir', 'Bahasa tersulit', 'Framework terbaru'], answer: 1 },
      { q: 'Status setelah lulus bab 10?', options: ['Murid', 'Magang', 'Ksatria Kode', 'Arsitek'], answer: 2 },
    ],
  },
];

const LEVELS = [
  { xp: 0, title: 'Berudu Baru' },
  { xp: 60, title: 'Kodok Muda' },
  { xp: 130, title: 'Kodok Petualang' },
  { xp: 220, title: 'Kodok Pejuang' },
  { xp: 330, title: 'Kodok Sesepuh' },
  { xp: 460, title: 'Ksatria Kode' },
];

const ICONS = {
  seed: 'M12 2C9 6 5 8 5 13a7 7 0 0 0 14 0c0-5-4-7-7-11z',
  bee: 'M12 3l2.5 5 5.5.5-4.3 3.6 1.4 5.4-5.1-3.2L7 17.5l1.4-5.4L4.1 8.5l5.5-.5z',
  gorilla: 'M7 4c-2 4-2 8 1 10-2 2-2 5 1 6 3 1 5-1 5-4 0 3 2 5 5 4 3-1 3-4 1-6 3-2 3-6 1-10-2 3-4 4-6 4S9 7 7 4z',
  wizard: 'M9 21l-1-9 4-9 4 9-1 9z M5 21h14',
  books: 'M4 4h6v16H4z M14 4h6v16h-6z M4 8h6 M4 12h6 M14 8h6 M14 12h6',
  tower: 'M8 21V8l4-6 4 6v13 M5 21h14 M12 12h.01',
  gate: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M5 21h14 M9 21v-4h6v4',
  dragon: 'M4 15c4-6 12-8 16-3-2 1-2 3-4 4l-4 1-4 4-1-5-3-1z M14 7l2-3 2 3',
  temple: 'M4 10l8-7 8 7 M6 10v9 M18 10v9 M4 21h16 M9 21v-5h6v5',
  knight: 'M12 2l2.5 6L21 10l-6.5 2L12 19l-2.5-7L3 10l6.5-2z',
};
