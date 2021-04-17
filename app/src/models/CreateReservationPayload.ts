import * as Yup from "yup";

export interface CreateReservationPayload {
  from: string;
  to: string;
  userId?: string;
}

export const createReservationValidationSchema = Yup.object({
  isManager: Yup.boolean(),
  userId: Yup.string().when("isReceptionist", {
    is: true,
    then: Yup.string().required("Recepcni musi zadat uzivatele"),
  }),
  from: Yup.date().required(),
  to: Yup.string()
    .required("Dobra trvani musi byt vyplnena")
    .test("is-valid-time", "Musi byt platny cas", (v) => {
      if (!v) {
        return false;
      }
      const [hours, minutes] = v.split(":").map((d) => +d);
      if (isNaN(hours) || isNaN(minutes)) {
        return false;
      }
      return true;
    })
    .test("is-valid-time", "Musi byt alespon 30 minut", (v) => {
      if (!v) {
        return false;
      }
      const [hours, minutes] = v.split(":").map((d) => +d);
      if (isNaN(hours) || isNaN(minutes)) {
        return false;
      }
      return hours > 0 || (hours === 0 && minutes >= 30);
    })
    .when("isManager", {
      is: true,
      otherwise: Yup.string().test(
        "is-shorter-than",
        "Cas musi byt kratsi nez 8h",
        (v) => {
          if (!v) {
            return false;
          }
          const [hours, minutes] = v.split(":").map((d) => +d);
          if (isNaN(hours) || isNaN(minutes)) {
            return false;
          }
          return hours < 8 || (hours === 8 && minutes === 0);
        }
      ),
    }),
});
