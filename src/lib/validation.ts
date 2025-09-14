import { z } from "zod";
import type { House } from "../types";

const HOUSE_VALUES: House[] = ["faerie", "phoenix", "thunderbird", "unicorn"];

export const studentRegistrationSchema = z.object({
  ten: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không hợp lệ")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái và khoảng trắng"),

  mssv: z
    .string()
    .min(1, "MSSV không được để trống")
    .regex(/^(SE|SA|SS)\d{6}$/i, "MSSV không đúng định dạng")
    .transform((val) => val.toUpperCase()),

  sdt: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .refine(
      (val) => {
        const phoneRegex = /^(84|0(3|5|7|8|9))\d{8}$/;
        return phoneRegex.test(val);
      },
      { message: "Số điện thoại không hợp lệ" }
    ),

  lop: z
    .string()
    .min(1, "Lớp không được để trống")
    .regex(/^[1-10]$/, "Lớp không hợp lệ"),

  daiDoi: z
    .string()
    .min(1, "Đại đội không được để trống")
    .regex(/^[1-4]$/, "Đại đội không hợp lệ"),

  nha: z
    .string()
    .min(1, "Nhà không được để trống")
    .refine((val) => HOUSE_VALUES.includes(val as House), {
      message: "Nhà không hợp lệ",
    }),
});

export type StudentRegistrationForm = z.infer<typeof studentRegistrationSchema>;
