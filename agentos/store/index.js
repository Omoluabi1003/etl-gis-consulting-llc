'use strict';

const { getEnv } = require('../../api/_utils');
const { SupabaseAgentOSStore } = require('./supabase-store');
const { MemoryAgentOSStore } = require('./memory-store');

const runtimeStore = new MemoryAgentOSStore();
const selectAgentOSStore = () => {
  const configured = Boolean(getEnv('SUPABASE_URL') && getEnv('SUPABASE_SERVICE_ROLE_KEY'));
  return { store: configured ? new SupabaseAgentOSStore() : runtimeStore, durable: configured };
};

module.exports = { selectAgentOSStore };
