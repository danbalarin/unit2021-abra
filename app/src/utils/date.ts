import { isToday, format, isTomorrow } from "date-fns";
import { cs } from "date-fns/locale";

export const dateToText = (date: string) =>
  isToday(new Date(date))
    ? "Dnes"
    : isTomorrow(new Date(date))
    ? "Zitra"
    : format(new Date(date), "dd. MMMM", { locale: cs });

export const timeRangeToText = (from: string, to: string) =>
  `${format(new Date(from), "HH:mm")}-${format(new Date(to), "HH:mm")}`;

export const formatRFC = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");
