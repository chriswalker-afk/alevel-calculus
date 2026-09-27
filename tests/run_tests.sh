#!/usr/bin/env sh
set -eu
python3 tests/test_appshell.py
node tests/appshell_dom_test.mjs
node tests/local_state_store_test.mjs
node tests/progress_store_test.mjs
node tests/progress_model_test.mjs
node tests/help_content_test.mjs
node tests/vocabulary_store_test.mjs
node tests/word_bank_model_test.mjs
node tests/topic_metadata_test.mjs

node tests/generator_runner_test.mjs
node tests/feedback_system_test.mjs
node tests/question_shell_test.mjs
node tests/question_generator_diversity_test.mjs
node tests/graph_question_interactions_batch1_test.mjs
node tests/graph_question_interactions_batch2_test.mjs
node tests/graph_question_interactions_batch3_test.mjs
node tests/graph_question_interactions_batch4_test.mjs
node tests/topic_objectives_pass_test.mjs
node tests/question_practice_session_test.mjs
node tests/question_response_enhancements_test.mjs
node tests/math_renderer_test.mjs

node tests/diagnostic_router_test.mjs
node tests/mastery_feedback_model_test.mjs
node tests/classwiz_support_test.mjs

node tests/memory_item_test.mjs
node tests/flashcard_engine_test.mjs
node tests/match_engine_test.mjs

node tests/memory_games_test.mjs
node tests/memory_game_engines_test.mjs
node tests/rapid_recall_engine_test.mjs
node tests/diagram_recall_engine_test.mjs
node tests/memory_mix_engine_test.mjs

node tests/diagram_primitives_test.mjs

node tests/linked_function_gradient_explorer_test.mjs

node tests/chord_to_tangent_explorer_test.mjs

node tests/family_of_curves_explorer_test.mjs

node tests/area_explorer_test.mjs
node tests/parametric_curve_tracer_test.mjs
node tests/rate_flow_diagram_test.mjs
node tests/rectangle_sum_explorer_test.mjs
node tests/trapezium_rule_builder_test.mjs

node tests/basics_understand_test.mjs

node tests/basics_memorise_test.mjs

node tests/basics_assessment_test.mjs

node tests/reference_topic_freeze_test.mjs

node tests/pre_calculus_intro_test.mjs

node tests/first_principles_understand_test.mjs
node tests/first_principles_step39_test.mjs

node tests/tangents_normals_step40_test.mjs

node tests/stationary_points_step41_test.mjs
node tests/stationary_points_step42_test.mjs

node tests/increasing_decreasing_step43_test.mjs

node tests/integration_intro_step44_test.mjs

node tests/definite_indefinite_step45_test.mjs

node tests/integration_area_step46_test.mjs

node tests/signed_area_step47_test.mjs

node tests/year12_review_step48_test.mjs

node tests/year12_regression_step49_test.mjs

node tests/standard_functions_step50_test.mjs
node tests/trig_first_principles_step51_test.mjs

node tests/product_quotient_chain_step52_test.mjs
node tests/product_quotient_chain_step53_test.mjs

node tests/parametric_differentiation_step54_test.mjs

node tests/implicit_differentiation_step55_test.mjs

node tests/trig_identities_inverse_step56_test.mjs

node tests/concavity_inflection_step57_test.mjs

node tests/connected_rates_step58_test.mjs

node tests/full_differentiation_review_step59_test.mjs
node tests/standard_integrals_step60_test.mjs
node tests/reverse_chain_rule_step61_test.mjs
node tests/trig_identity_integration_step62_test.mjs

node tests/substitution_step63_test.mjs
node tests/substitution_step64_test.mjs
node tests/integration_by_parts_step65_test.mjs
node tests/partial_fractions_step66_test.mjs

node tests/year13_areas_step67_test.mjs
node tests/parametric_area_step68_test.mjs

node tests/limit_of_sum_step69_test.mjs
node tests/numerical_integration_step70_test.mjs

node tests/integration_method_audit_step71_test.mjs

node tests/differential_equations_step72_test.mjs
node tests/differential_equations_step73_test.mjs
node tests/calculus_modelling_step74_test.mjs
node tests/full_calculus_mastery_step75_test.mjs

node tests/curriculum_coverage_step76_test.mjs

node tests/mathematical_correctness_step77_test.mjs

node tests/interactive_visual_audit_step78_test.mjs

node tests/responsive_accessibility_step79_test.mjs

node tests/understand_visual_integrity_test.mjs

node tests/persistence_state_recovery_step80_test.mjs

node tests/code_reuse_performance_step81_test.mjs

node tests/final_student_journey_step82_test.mjs
