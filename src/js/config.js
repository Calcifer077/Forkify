// The goal of this file is to contain all the common elements accross the application

// upper case used for constants

// All env variables comes from 'config.env' which is defined in deployment envoirnment.
export const API_URL = process.env.API_URL;
export const TIMEOUT_SEC = Number(process.env.TIMEOUT_SEC);
export const RES_PER_PAGE = Number(process.env.RES_PER_PAGE);
export const KEY = process.env.KEY;
export const MODAL_CLOSE_SEC = Number(process.env.MODAL_CLOSE_SEC);
