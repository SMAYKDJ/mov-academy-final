// Configuração central do Supabase
const SUPABASE_URL = "https://hnrrwynukzerysxgsvvl.supabase.co";
const SUPABASE_KEY = "sb_publishable_34134WYds3wEeErr_xpE-Q_SocH4GWS";

// Inicializa o cliente Supabase globalmente
const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Exporta para uso em outros scripts
window.supabaseClient = supabaseClient;
