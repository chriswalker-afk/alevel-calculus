import { basicsDifferentiationTopic } from './topic-content/basics-differentiation.js';
import { firstPrinciplesTopic } from './topic-content/first-principles.js';
import { tangentsNormalsTopic } from './topic-content/tangents-normals.js';
import { stationaryPointsTopic } from './topic-content/stationary-points.js';
import { increasingDecreasingTopic } from './topic-content/increasing-decreasing.js';
import { standardFunctionsTopic } from './topic-content/standard-functions.js';
import { trigFirstPrinciplesTopic } from './topic-content/trig-first-principles.js';
import { productQuotientChainTopic } from './topic-content/product-quotient-chain.js';
import { parametricDifferentiationTopic } from './topic-content/parametric-differentiation.js';
import { implicitDifferentiationTopic } from './topic-content/implicit-differentiation.js';
import { trigIdentitiesInverseTopic } from './topic-content/trig-identities-inverse.js';
import { concavityInflectionTopic } from './topic-content/concavity-inflection.js';
import { connectedRatesTopic } from './topic-content/connected-rates.js';
export const fullDifferentiationReviewSourceTopics=Object.freeze([
 basicsDifferentiationTopic,firstPrinciplesTopic,tangentsNormalsTopic,stationaryPointsTopic,increasingDecreasingTopic,
 standardFunctionsTopic,trigFirstPrinciplesTopic,productQuotientChainTopic,parametricDifferentiationTopic,
 implicitDifferentiationTopic,trigIdentitiesInverseTopic,concavityInflectionTopic,connectedRatesTopic
]);
const skillIndex=new Map(fullDifferentiationReviewSourceTopics.flatMap(topic=>topic.microSkills.map(skill=>[skill.microSkillId,Object.freeze({topicId:topic.topicId,topicTitle:topic.title,microSkillId:skill.microSkillId,title:skill.title})])));
export function getFullDifferentiationReviewMicroSkillLabel(id){return skillIndex.get(id)?.title??id.replace(/^skill:(?:y12|y13):/,'').replaceAll(':',' › ').replaceAll('-',' ');}
export function listFullDifferentiationReviewSourceMicroSkills(){return [...skillIndex.values()];}
