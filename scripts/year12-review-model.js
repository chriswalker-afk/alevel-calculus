import { basicsDifferentiationTopic } from './topic-content/basics-differentiation.js';
import { firstPrinciplesTopic } from './topic-content/first-principles.js';
import { tangentsNormalsTopic } from './topic-content/tangents-normals.js';
import { stationaryPointsTopic } from './topic-content/stationary-points.js';
import { increasingDecreasingTopic } from './topic-content/increasing-decreasing.js';
import { integrationIntroTopic } from './topic-content/integration-intro.js';
import { definiteIndefiniteTopic } from './topic-content/definite-indefinite-integration.js';
import { integrationAreaTopic } from './topic-content/integration-area.js';
import { signedAreaTopic } from './topic-content/signed-area.js';

export const year12ReviewSourceTopics=Object.freeze([
  basicsDifferentiationTopic,firstPrinciplesTopic,tangentsNormalsTopic,stationaryPointsTopic,increasingDecreasingTopic,
  integrationIntroTopic,definiteIndefiniteTopic,integrationAreaTopic,signedAreaTopic
]);

const skillIndex=new Map(year12ReviewSourceTopics.flatMap(topic=>topic.microSkills.map(skill=>[skill.microSkillId,Object.freeze({topicId:topic.topicId,topicTitle:topic.title,microSkillId:skill.microSkillId,title:skill.title})])));

export function getYear12ReviewMicroSkill(microSkillId){return skillIndex.get(microSkillId)??null;}
export function getYear12ReviewMicroSkillLabel(microSkillId){return skillIndex.get(microSkillId)?.title??microSkillId.replace(/^skill:y12:/,'').replaceAll(':',' › ').replaceAll('-',' ');}
export function listYear12ReviewSourceMicroSkills(){return [...skillIndex.values()];}
