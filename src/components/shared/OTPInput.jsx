import { useRef } from "react";

export default function OTPInput({ length = 6, value = "", onChange }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    
    // Ambil karakter terakhir jika user mengetik menimpa angka yang sudah ada
    const inputChar = val.slice(-1);

    // Hanya izinkan angka atau penghapusan (string kosong)
    if (inputChar !== "" && !/^\d$/.test(inputChar)) return;

    // Buat array sepanjang 'length', isi dengan spasi jika data kosong
    // Tujuannya agar posisi index kotak tetap terjaga
    const otpArray = Array.from({ length }, (_, i) => value[i] || " ");

    // Update data di kotak (index) tempat user mengetik
    otpArray[index] = inputChar || " "; 

    // Gabungkan kembali menjadi string, hapus spasi berlebih di akhir
    const newValue = otpArray.join("").trimEnd();
    onChange(newValue);

    // Otomatis pindah fokus ke kotak berikutnya jika diketik
    if (inputChar && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Kembali ke kotak sebelumnya jika tombol Backspace ditekan pada kotak yang kosong
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    if (pasted.length === length) {
      inputsRef.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          // Tampilkan value, tapi jangan tampilkan spasi (spasi murni untuk patokan index internal)
          value={value[index] === " " || !value[index] ? "" : value[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 rounded-xl border border-gray-300 bg-white text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-coffee-orange-500 focus:border-coffee-orange-500 transition"
        />
      ))}
    </div>
  );
}