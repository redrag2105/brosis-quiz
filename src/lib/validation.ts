import { z } from "zod";

export const studentRegistrationSchema = z.object({
  ten: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái và khoảng trắng"),

  mssv: z
    .string()
    .regex(
      /^[A-Z]{2}\d{6}$/,
      "MSSV phải có định dạng XX123456 (2 chữ cái + 6 số)"
    ),

  sdt: z.string().regex(/^(0|\+84)[1-9]\d{8}$/, "Số điện thoại không hợp lệ"),

  lop: z
    .string()
    .min(1, "Vui lòng nhập lớp")
    .max(20, "Tên lớp không được quá 20 ký tự"),

  nha: z
    .string()
    .min(1, "Vui lòng chọn nhà")
    .refine((val) => val !== undefined, {
      message: "Vui lòng chọn một nhà hợp lệ",
    }),

  daiDoi: z
    .string()
    .min(1, "Vui lòng nhập đại đội")
    .max(20, "Tên đại đội không được quá 20 ký tự"),
});

export type StudentRegistrationForm = z.infer<typeof studentRegistrationSchema>;
