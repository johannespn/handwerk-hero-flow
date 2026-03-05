import { RecruitmentWizard } from "@/components/recruitment/RecruitmentWizard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  return <RecruitmentWizard clientId="demo-client" tradeType="Elektriker" supabaseClient={supabase} />;
};

export default Index;
