import CRFFNLogo from "../components/icons/CRFFNLogo";
import FRSCLogo from "../components/icons/FRSCLogo";
import NISLogo from "../components/icons/NISLogo";
import OtherLogo from "../components/icons/OtherLogo";
import { Service } from "../types/transaction";

export const services: Service[] = [
  { id: "nis", name: "Nigeria Immigration Service (NIS)", icon: NISLogo },
  { id: "frsc", name: "Federal Road Safety Commission (FRSC)", icon: FRSCLogo },
  { id: "crffn", name: "Council for the Regulation of Freight Forwarding in Nigeria (CRFFN)", icon: CRFFNLogo },
  { id: "others", name: "Other", icon: OtherLogo },
];