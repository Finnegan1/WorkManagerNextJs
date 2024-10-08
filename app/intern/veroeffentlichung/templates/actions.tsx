'use server'

import prisma from '@/lib/prisma';
import { PdfTemplate } from '@prisma/client';
import { JsonArray } from '@prisma/client/runtime/library';
import { execSync } from 'child_process';
import fs from 'fs';

export type TemplateCreate = {
    name: string;
    description: string;
    basePdf: string;
    schemas: JsonArray;
    neededFields: string[];
}

// Create a new template
export async function createTemplate(template: TemplateCreate): Promise<PdfTemplate> {
    try {
        const schemas = template.schemas as any[]
        const newTemplate = await prisma.pdfTemplate.create({
            data: {
                name: template.name,
                description: template.description,
                basePdf: template.basePdf,
                schemas: schemas,
                neededFields: template.neededFields,
            },
        });
        return newTemplate;
    } catch (error) {
        console.error('Error creating template:', error);
        throw new Error(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export async function getTemplates(): Promise<string[]> {
    //read which folders exist in assets/templates
    const folders = fs.readdirSync('assets/templates', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    console.log(folders);
    return folders;
}

export async function getTemplate(id: number): Promise<PdfTemplate> {
    try {
        const template = await prisma.pdfTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new Error('Template not found');
        }
        return template;
    } catch (error) {
        console.error('Error fetching template:', error);
        throw new Error('Failed to fetch template');
    }
}

// Update a template
export async function updateTemplate(id: number, template: TemplateCreate): Promise<PdfTemplate> {
    try {
        const schemas = template.schemas as any[]
        const updatedTemplate = await prisma.pdfTemplate.update({
            where: { id },
            data: {
                name: template.name,
                description: template.description,
                basePdf: template.basePdf,
                schemas: schemas,
                neededFields: template.neededFields,
            },
        });
        return updatedTemplate;
    } catch (error) {
        console.error('Error updating template:', error);
        throw new Error('Failed to update template');
    }
}

// Delete a template
export async function deleteTemplate(id: number): Promise<void> {
    try {
        await prisma.pdfTemplate.delete({
            where: { id },
        });
    } catch (error) {
        console.error('Error deleting template:', error);
        throw new Error('Failed to delete template');
    }
}

export async function reloadTemplates() {
    try {
        fs.rmSync('assets/templates', { recursive: true, force: true });
        execSync(`git clone --depth 1 --no-checkout ${process.env.TEMPLATES_GITHUB_REPO} assets/templates && cd assets/templates && git config core.sparseCheckout true && echo '*' > .git/info/sparse-checkout && git checkout main && rm -rf .git`);
        return true;
    } catch (error) {
        console.error('Error reloading templates:', error);
        throw new Error('Failed to reload templates');
    }
}