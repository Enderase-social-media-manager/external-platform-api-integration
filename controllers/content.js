import { publishContents,editContent,removeContent } from '../models/content.js';

export async function createContent(req, res) {
  publishContents(req, res);
}
export async function updateContent(req, res) {
  editContent(req,res);
}

export async function deleteContent  (req, res) {
  removeContent(req,res);
};
