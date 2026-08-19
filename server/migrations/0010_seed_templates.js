// Carga las plantillas de extraccion base. Antes corria en un setTimeout de 3
// segundos tras arrancar el proceso, que en serverless a menudo no llegaba a
// ejecutarse.

import { seedTemplates } from '../seedTemplates.js';

export default async function run() {
  await seedTemplates();
  return 'plantillas base sembradas';
}
