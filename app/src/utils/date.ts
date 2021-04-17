import { isToday, format, isTomorrow } from "date-fns";
import { cs } from "date-fns/locale";

export const dateToText = (date: Date) =>
  isToday(date)
    ? "Dnes"
    : isTomorrow(date)
    ? "Zitra"
    : format(date, "dd. MMMM", { locale: cs });

export const timeRangeToText = (from: Date, to: Date) =>
  `${format(from, "hh:mm")}-${format(to, "hh:mm")}`;

export const formatRFC = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");
